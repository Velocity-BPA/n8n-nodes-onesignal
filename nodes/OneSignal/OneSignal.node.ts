/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	oneSignalApiRequest,
	oneSignalApiRequestAllItems,
	buildNotificationBody,
	buildUserBody,
	buildSubscriptionBody,
	buildSegmentFilters,
	validateNotificationTargeting,
} from './GenericFunctions';

import { notificationOperations, notificationFields } from './descriptions/NotificationDescription';
import { userOperations, userFields } from './descriptions/UserDescription';
import { subscriptionOperations, subscriptionFields } from './descriptions/SubscriptionDescription';
import { segmentOperations, segmentFields } from './descriptions/SegmentDescription';
import { templateOperations, templateFields } from './descriptions/TemplateDescription';
import { appOperations, appFields } from './descriptions/AppDescription';
import { outcomeOperations, outcomeFields } from './descriptions/OutcomeDescription';
import { exportOperations, exportFields } from './descriptions/ExportDescription';

// Emit licensing notice once on node load
const LICENSING_NOTICE_KEY = Symbol.for('onesignal_licensing_notice');
if (!(globalThis as Record<symbol, boolean>)[LICENSING_NOTICE_KEY]) {
	console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
	(globalThis as Record<symbol, boolean>)[LICENSING_NOTICE_KEY] = true;
}

export class OneSignal implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OneSignal',
		name: 'oneSignal',
		icon: 'file:onesignal.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send push notifications, emails, and SMS via OneSignal',
		defaults: {
			name: 'OneSignal',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'oneSignalApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'App',
						value: 'app',
					},
					{
						name: 'Export',
						value: 'export',
					},
					{
						name: 'Notification',
						value: 'notification',
					},
					{
						name: 'Outcome',
						value: 'outcome',
					},
					{
						name: 'Segment',
						value: 'segment',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
					{
						name: 'Template',
						value: 'template',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'notification',
			},
			...notificationOperations,
			...notificationFields,
			...userOperations,
			...userFields,
			...subscriptionOperations,
			...subscriptionFields,
			...segmentOperations,
			...segmentFields,
			...templateOperations,
			...templateFields,
			...appOperations,
			...appFields,
			...outcomeOperations,
			...outcomeFields,
			...exportOperations,
			...exportFields,
		],
	};

	methods = {
		loadOptions: {
			async getSegments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('oneSignalApi');
				const appId = credentials.appId as string;

				const response = await oneSignalApiRequest.call(
					this,
					'GET',
					`/apps/${appId}/segments`,
					{},
					{ limit: 300 },
				);

				const segments = (response.segments as IDataObject[]) || [];
				return segments.map((segment) => ({
					name: segment.name as string,
					value: segment.name as string,
				}));
			},

			async getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('oneSignalApi');
				const appId = credentials.appId as string;

				const response = await oneSignalApiRequest.call(
					this,
					'GET',
					`/templates`,
					{},
					{ app_id: appId, limit: 300 },
				);

				const templates = (response.templates as IDataObject[]) || [];
				return templates.map((template) => ({
					name: template.name as string,
					value: template.id as string,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('oneSignalApi');
		const appId = credentials.appId as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ----------------------------------------
				//           notification
				// ----------------------------------------
				if (resource === 'notification') {
					if (operation === 'create') {
						const body = buildNotificationBody.call(this, i, appId);
						validateNotificationTargeting.call(this, body);
						responseData = await oneSignalApiRequest.call(this, 'POST', '/notifications', body);
					}

					if (operation === 'get') {
						const notificationId = this.getNodeParameter('notificationId', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'GET',
							`/notifications/${notificationId}`,
							{},
							{ app_id: appId },
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('notificationFilters', i, {}) as IDataObject;
						const qs: IDataObject = { app_id: appId };

						if (filters.kind !== undefined && filters.kind !== '') {
							qs.kind = filters.kind;
						}

						if (returnAll) {
							responseData = await oneSignalApiRequestAllItems.call(
								this,
								'GET',
								'/notifications',
								{},
								qs,
								'notifications',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = Math.min(limit, 50);
							const response = await oneSignalApiRequest.call(this, 'GET', '/notifications', {}, qs);
							responseData = (response.notifications as IDataObject[]) || [];
						}
					}

					if (operation === 'cancel') {
						const notificationId = this.getNodeParameter('notificationId', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'DELETE',
							`/notifications/${notificationId}`,
							{},
							{ app_id: appId },
						);
					}

					if (operation === 'getHistory') {
						const notificationId = this.getNodeParameter('notificationId', i) as string;
						const historyOptions = this.getNodeParameter('historyOptions', i, {}) as IDataObject;

						const body: IDataObject = {
							app_id: appId,
						};

						if (historyOptions.events) {
							body.events = historyOptions.events;
						}
						if (historyOptions.email) {
							body.email = historyOptions.email;
						}

						responseData = await oneSignalApiRequest.call(
							this,
							'POST',
							`/notifications/${notificationId}/history`,
							body,
						);
					}
				}

				// ----------------------------------------
				//           user
				// ----------------------------------------
				if (resource === 'user') {
					if (operation === 'create') {
						const body = buildUserBody.call(this, i);
						responseData = await oneSignalApiRequest.call(
							this,
							'POST',
							`/apps/${appId}/users`,
							body,
						);
					}

					if (operation === 'get') {
						const aliasType = this.getNodeParameter('aliasType', i) as string;
						const aliasValue = this.getNodeParameter('aliasValue', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'GET',
							`/apps/${appId}/users/by/${aliasType}/${aliasValue}`,
						);
					}

					if (operation === 'update') {
						const aliasType = this.getNodeParameter('aliasType', i) as string;
						const aliasValue = this.getNodeParameter('aliasValue', i) as string;
						const body = buildUserBody.call(this, i);

						const updateExternalId = this.getNodeParameter('updateExternalId', i, '') as string;
						if (updateExternalId) {
							body.identity = { ...(body.identity as IDataObject || {}), external_id: updateExternalId };
						}

						responseData = await oneSignalApiRequest.call(
							this,
							'PATCH',
							`/apps/${appId}/users/by/${aliasType}/${aliasValue}`,
							body,
						);
					}

					if (operation === 'delete') {
						const aliasType = this.getNodeParameter('aliasType', i) as string;
						const aliasValue = this.getNodeParameter('aliasValue', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'DELETE',
							`/apps/${appId}/users/by/${aliasType}/${aliasValue}`,
						);
					}
				}

				// ----------------------------------------
				//           subscription
				// ----------------------------------------
				if (resource === 'subscription') {
					if (operation === 'create') {
						const userAliasType = this.getNodeParameter('userAliasType', i) as string;
						const userAliasValue = this.getNodeParameter('userAliasValue', i) as string;
						const body = buildSubscriptionBody.call(this, i);

						responseData = await oneSignalApiRequest.call(
							this,
							'POST',
							`/apps/${appId}/users/by/${userAliasType}/${userAliasValue}/subscriptions`,
							{ subscription: body },
						);
					}

					if (operation === 'get') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'GET',
							`/apps/${appId}/subscriptions/${subscriptionId}`,
						);
					}

					if (operation === 'update') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const body = buildSubscriptionBody.call(this, i);

						const updateToken = this.getNodeParameter('updateToken', i, '') as string;
						if (updateToken) {
							body.token = updateToken;
						}

						responseData = await oneSignalApiRequest.call(
							this,
							'PATCH',
							`/apps/${appId}/subscriptions/${subscriptionId}`,
							{ subscription: body },
						);
					}

					if (operation === 'delete') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'DELETE',
							`/apps/${appId}/subscriptions/${subscriptionId}`,
						);
					}

					if (operation === 'transfer') {
						const subscriptionId = this.getNodeParameter('transferSubscriptionId', i) as string;
						const targetAliasType = this.getNodeParameter('targetAliasType', i) as string;
						const targetAliasValue = this.getNodeParameter('targetAliasValue', i) as string;

						responseData = await oneSignalApiRequest.call(
							this,
							'PATCH',
							`/apps/${appId}/subscriptions/${subscriptionId}/owner`,
							{
								identity: {
									[targetAliasType]: targetAliasValue,
								},
							},
						);
					}
				}

				// ----------------------------------------
				//           segment
				// ----------------------------------------
				if (resource === 'segment') {
					if (operation === 'create') {
						const segmentName = this.getNodeParameter('segmentName', i) as string;
						const filters = buildSegmentFilters.call(this, i);

						const body: IDataObject = {
							name: segmentName,
						};

						if (filters.length > 0) {
							body.filters = filters;
						}

						responseData = await oneSignalApiRequest.call(
							this,
							'POST',
							`/apps/${appId}/segments`,
							body,
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await oneSignalApiRequestAllItems.call(
								this,
								'GET',
								`/apps/${appId}/segments`,
								{},
								{},
								'segments',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await oneSignalApiRequest.call(
								this,
								'GET',
								`/apps/${appId}/segments`,
								{},
								{ limit },
							);
							responseData = (response.segments as IDataObject[]) || [];
						}
					}

					if (operation === 'delete') {
						const segmentId = this.getNodeParameter('segmentId', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'DELETE',
							`/apps/${appId}/segments/${segmentId}`,
						);
					}
				}

				// ----------------------------------------
				//           template
				// ----------------------------------------
				if (resource === 'template') {
					if (operation === 'create') {
						const templateName = this.getNodeParameter('templateName', i) as string;
						const templateType = this.getNodeParameter('templateType', i) as string;

						const body: IDataObject = {
							name: templateName,
							app_id: appId,
						};

						if (templateType === 'push' || templateType === 'sms') {
							const contentType = this.getNodeParameter('templateContentType', i, 'simple') as string;

							if (contentType === 'simple') {
								const content = this.getNodeParameter('templateContent', i, '') as string;
								if (content) {
									body.contents = { en: content };
								}
								if (templateType === 'push') {
									const heading = this.getNodeParameter('templateHeading', i, '') as string;
									if (heading) {
										body.headings = { en: heading };
									}
								}
							} else {
								const localizedContent = this.getNodeParameter('templateLocalizedContent.contentValues', i, []) as IDataObject[];
								if (localizedContent.length > 0) {
									const contents: Record<string, string> = {};
									const headings: Record<string, string> = {};
									for (const item of localizedContent) {
										if (item.language && item.content) {
											contents[item.language as string] = item.content as string;
										}
										if (item.language && item.heading) {
											headings[item.language as string] = item.heading as string;
										}
									}
									if (Object.keys(contents).length > 0) {
										body.contents = contents;
									}
									if (Object.keys(headings).length > 0) {
										body.headings = headings;
									}
								}
							}
						}

						if (templateType === 'email') {
							const emailSubject = this.getNodeParameter('templateEmailSubject', i, '') as string;
							const emailBody = this.getNodeParameter('templateEmailBody', i, '') as string;
							if (emailSubject) body.email_subject = emailSubject;
							if (emailBody) body.email_body = emailBody;
						}

						const additionalFields = this.getNodeParameter('templateAdditionalFields', i, {}) as IDataObject;
						if (additionalFields.url) body.url = additionalFields.url;
						if (additionalFields.bigPicture) body.big_picture = additionalFields.bigPicture;
						if (additionalFields.emailFromName) body.email_from_name = additionalFields.emailFromName;
						if (additionalFields.emailFromAddress) body.email_from_address = additionalFields.emailFromAddress;
						if (additionalFields.emailPreheader) body.email_preheader = additionalFields.emailPreheader;

						responseData = await oneSignalApiRequest.call(this, 'POST', '/templates', body);
					}

					if (operation === 'get') {
						const templateId = this.getNodeParameter('templateId', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'GET',
							`/templates/${templateId}`,
							{},
							{ app_id: appId },
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const qs: IDataObject = { app_id: appId };

						if (returnAll) {
							responseData = await oneSignalApiRequestAllItems.call(
								this,
								'GET',
								'/templates',
								{},
								qs,
								'templates',
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await oneSignalApiRequest.call(this, 'GET', '/templates', {}, qs);
							responseData = (response.templates as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const templateId = this.getNodeParameter('templateId', i) as string;
						const templateType = this.getNodeParameter('templateType', i) as string;
						const body: IDataObject = { app_id: appId };

						const updateName = this.getNodeParameter('updateTemplateName', i, '') as string;
						if (updateName) body.name = updateName;

						if (templateType === 'push' || templateType === 'sms') {
							const contentType = this.getNodeParameter('templateContentType', i, 'simple') as string;

							if (contentType === 'simple') {
								const content = this.getNodeParameter('templateContent', i, '') as string;
								if (content) body.contents = { en: content };
								if (templateType === 'push') {
									const heading = this.getNodeParameter('templateHeading', i, '') as string;
									if (heading) body.headings = { en: heading };
								}
							}
						}

						if (templateType === 'email') {
							const emailSubject = this.getNodeParameter('templateEmailSubject', i, '') as string;
							const emailBody = this.getNodeParameter('templateEmailBody', i, '') as string;
							if (emailSubject) body.email_subject = emailSubject;
							if (emailBody) body.email_body = emailBody;
						}

						const additionalFields = this.getNodeParameter('templateAdditionalFields', i, {}) as IDataObject;
						if (additionalFields.url) body.url = additionalFields.url;
						if (additionalFields.bigPicture) body.big_picture = additionalFields.bigPicture;

						responseData = await oneSignalApiRequest.call(
							this,
							'PATCH',
							`/templates/${templateId}`,
							body,
						);
					}

					if (operation === 'delete') {
						const templateId = this.getNodeParameter('templateId', i) as string;
						responseData = await oneSignalApiRequest.call(
							this,
							'DELETE',
							`/templates/${templateId}`,
							{},
							{ app_id: appId },
						);
					}
				}

				// ----------------------------------------
				//           app
				// ----------------------------------------
				if (resource === 'app') {
					if (operation === 'create') {
						const appName = this.getNodeParameter('appName', i) as string;
						const platformSettings = this.getNodeParameter('platformSettings', i, {}) as IDataObject;
						const organizationId = this.getNodeParameter('organizationId', i, '') as string;

						const body: IDataObject = { name: appName };

						if (platformSettings.apnsEnv) body.apns_env = platformSettings.apnsEnv;
						if (platformSettings.apnsP8) body.apns_p8 = platformSettings.apnsP8;
						if (platformSettings.apnsTeamId) body.apns_team_id = platformSettings.apnsTeamId;
						if (platformSettings.apnsKeyId) body.apns_key_id = platformSettings.apnsKeyId;
						if (platformSettings.apnsBundleId) body.apns_bundle_id = platformSettings.apnsBundleId;
						if (platformSettings.gcmKey) body.gcm_key = platformSettings.gcmKey;
						if (platformSettings.chromeWebOrigin) body.chrome_web_origin = platformSettings.chromeWebOrigin;
						if (platformSettings.chromeWebDefaultNotificationIcon) body.chrome_web_default_notification_icon = platformSettings.chromeWebDefaultNotificationIcon;
						if (platformSettings.safariSiteOrigin) body.safari_site_origin = platformSettings.safariSiteOrigin;
						if (platformSettings.safariPushId) body.safari_push_id = platformSettings.safariPushId;
						if (platformSettings.siteName) body.site_name = platformSettings.siteName;
						if (organizationId) body.organization_id = organizationId;

						responseData = await oneSignalApiRequest.call(this, 'POST', '/apps', body, {}, true);
					}

					if (operation === 'get') {
						const appIdParam = this.getNodeParameter('appIdParam', i, '') as string;
						const targetAppId = appIdParam || appId;
						responseData = await oneSignalApiRequest.call(this, 'GET', `/apps/${targetAppId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							const response = await oneSignalApiRequest.call(this, 'GET', '/apps', {}, {}, true);
							responseData = Array.isArray(response) ? response : [];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await oneSignalApiRequest.call(this, 'GET', '/apps', {}, {}, true);
							const apps = Array.isArray(response) ? response : [];
							responseData = apps.slice(0, limit);
						}
					}

					if (operation === 'update') {
						const appIdParam = this.getNodeParameter('appIdParam', i, '') as string;
						const targetAppId = appIdParam || appId;
						const platformSettings = this.getNodeParameter('platformSettings', i, {}) as IDataObject;
						const updateName = this.getNodeParameter('updateAppName', i, '') as string;

						const body: IDataObject = {};

						if (updateName) body.name = updateName;
						if (platformSettings.apnsEnv) body.apns_env = platformSettings.apnsEnv;
						if (platformSettings.apnsP8) body.apns_p8 = platformSettings.apnsP8;
						if (platformSettings.apnsTeamId) body.apns_team_id = platformSettings.apnsTeamId;
						if (platformSettings.apnsKeyId) body.apns_key_id = platformSettings.apnsKeyId;
						if (platformSettings.apnsBundleId) body.apns_bundle_id = platformSettings.apnsBundleId;
						if (platformSettings.gcmKey) body.gcm_key = platformSettings.gcmKey;
						if (platformSettings.chromeWebOrigin) body.chrome_web_origin = platformSettings.chromeWebOrigin;
						if (platformSettings.chromeWebDefaultNotificationIcon) body.chrome_web_default_notification_icon = platformSettings.chromeWebDefaultNotificationIcon;
						if (platformSettings.safariSiteOrigin) body.safari_site_origin = platformSettings.safariSiteOrigin;
						if (platformSettings.safariPushId) body.safari_push_id = platformSettings.safariPushId;
						if (platformSettings.siteName) body.site_name = platformSettings.siteName;

						responseData = await oneSignalApiRequest.call(
							this,
							'PUT',
							`/apps/${targetAppId}`,
							body,
							{},
							true,
						);
					}
				}

				// ----------------------------------------
				//           outcome
				// ----------------------------------------
				if (resource === 'outcome') {
					if (operation === 'get') {
						const outcomeNames = this.getNodeParameter('outcomeNames', i) as string[];
						const outcomeTimeRange = this.getNodeParameter('outcomeTimeRange', i) as string;
						const outcomePlatforms = this.getNodeParameter('outcomePlatforms', i, []) as string[];
						const outcomeAttribution = this.getNodeParameter('outcomeAttribution', i) as string;

						const qs: IDataObject = {
							outcome_names: outcomeNames.join(','),
							outcome_time_range: outcomeTimeRange,
							outcome_attribution: outcomeAttribution,
						};

						if (outcomePlatforms.length > 0) {
							qs.outcome_platforms = outcomePlatforms.join(',');
						}

						responseData = await oneSignalApiRequest.call(
							this,
							'GET',
							`/apps/${appId}/outcomes`,
							{},
							qs,
						);
					}
				}

				// ----------------------------------------
				//           export
				// ----------------------------------------
				if (resource === 'export') {
					if (operation === 'exportUsers') {
						const extraFields = this.getNodeParameter('extraFields', i, []) as string[];
						const segmentName = this.getNodeParameter('exportSegmentName', i, '') as string;

						const body: IDataObject = {};

						if (extraFields.length > 0) {
							body.extra_fields = extraFields;
						}
						if (segmentName) {
							body.segment_name = segmentName;
						}

						responseData = await oneSignalApiRequest.call(
							this,
							'POST',
							`/players/csv_export?app_id=${appId}`,
							body,
						);
					}

					if (operation === 'exportNotifications') {
						const extraNotificationFields = this.getNodeParameter('extraNotificationFields', i, []) as string[];

						const qs: IDataObject = { app_id: appId };

						if (extraNotificationFields.length > 0) {
							qs.extra_fields = extraNotificationFields.join(',');
						}

						responseData = await oneSignalApiRequest.call(
							this,
							'GET',
							'/notifications',
							{},
							{ ...qs, limit: 50 },
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
