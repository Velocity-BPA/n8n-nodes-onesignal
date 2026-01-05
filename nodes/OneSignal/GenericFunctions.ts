/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IPollFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://api.onesignal.com';

export async function oneSignalApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	useUserAuthKey = false,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('oneSignalApi');

	const authKey = useUserAuthKey && credentials.userAuthKey
		? credentials.userAuthKey
		: credentials.restApiKey;

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			'Authorization': `Basic ${authKey}`,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: error.message || 'OneSignal API request failed',
		});
	}
}

export async function oneSignalApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	propertyName: string,
	limit = 0,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	let hasMoreItems = true;

	qs.limit = 50;
	qs.offset = 0;

	while (hasMoreItems) {
		responseData = await oneSignalApiRequest.call(this, method, endpoint, body, qs);
		const items = (responseData[propertyName] as IDataObject[]) || [];
		returnData.push(...items);

		if (limit > 0 && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}

		qs.offset = (qs.offset as number) + items.length;

		if (items.length < (qs.limit as number)) {
			hasMoreItems = false;
		}
	}

	return returnData;
}

export function validateNotificationTargeting(
	this: IExecuteFunctions,
	body: IDataObject,
): void {
	const hasSegments = body.included_segments && (body.included_segments as string[]).length > 0;
	const hasFilters = body.filters && (body.filters as IDataObject[]).length > 0;
	const hasAliases = body.include_aliases && Object.keys(body.include_aliases as IDataObject).length > 0;
	const hasSubscriptionIds = body.include_subscription_ids && (body.include_subscription_ids as string[]).length > 0;

	if (!hasSegments && !hasFilters && !hasAliases && !hasSubscriptionIds) {
		throw new NodeOperationError(
			this.getNode(),
			'You must specify at least one targeting option: segments, filters, aliases, or subscription IDs',
		);
	}
}

export function buildNotificationBody(
	this: IExecuteFunctions,
	itemIndex: number,
	appId: string,
): IDataObject {
	const body: IDataObject = {
		app_id: appId,
	};

	// Target channel
	const targetChannel = this.getNodeParameter('targetChannel', itemIndex, 'push') as string;
	body.target_channel = targetChannel;

	// Targeting
	const targetingType = this.getNodeParameter('targetingType', itemIndex) as string;

	if (targetingType === 'segments') {
		const includedSegments = this.getNodeParameter('includedSegments', itemIndex, []) as string[];
		const excludedSegments = this.getNodeParameter('excludedSegments', itemIndex, []) as string[];

		if (includedSegments.length > 0) {
			body.included_segments = includedSegments;
		}
		if (excludedSegments.length > 0) {
			body.excluded_segments = excludedSegments;
		}
	} else if (targetingType === 'filters') {
		const filters = this.getNodeParameter('filters.filterValues', itemIndex, []) as IDataObject[];
		if (filters.length > 0) {
			body.filters = filters;
		}
	} else if (targetingType === 'aliases') {
		const aliasType = this.getNodeParameter('aliasType', itemIndex, 'external_id') as string;
		const aliasValues = this.getNodeParameter('aliasValues', itemIndex, '') as string;

		if (aliasValues) {
			body.include_aliases = {
				[aliasType]: aliasValues.split(',').map((v) => v.trim()),
			};
		}
	} else if (targetingType === 'subscriptionIds') {
		const subscriptionIds = this.getNodeParameter('subscriptionIds', itemIndex, '') as string;
		if (subscriptionIds) {
			body.include_subscription_ids = subscriptionIds.split(',').map((v) => v.trim());
		}
	}

	// Content
	if (targetChannel === 'push' || targetChannel === 'sms') {
		const contentType = this.getNodeParameter('contentType', itemIndex, 'simple') as string;

		if (contentType === 'simple') {
			const content = this.getNodeParameter('content', itemIndex, '') as string;
			if (content) {
				body.contents = { en: content };
			}

			if (targetChannel === 'push') {
				const heading = this.getNodeParameter('heading', itemIndex, '') as string;
				if (heading) {
					body.headings = { en: heading };
				}
			}
		} else {
			const localizedContent = this.getNodeParameter('localizedContent.contentValues', itemIndex, []) as IDataObject[];
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

	// Email specific
	if (targetChannel === 'email') {
		const emailSubject = this.getNodeParameter('emailSubject', itemIndex, '') as string;
		const emailBody = this.getNodeParameter('emailBody', itemIndex, '') as string;

		if (emailSubject) {
			body.email_subject = emailSubject;
		}
		if (emailBody) {
			body.email_body = emailBody;
		}

		const additionalEmailFields = this.getNodeParameter('additionalEmailFields', itemIndex, {}) as IDataObject;
		if (additionalEmailFields.emailFromName) {
			body.email_from_name = additionalEmailFields.emailFromName;
		}
		if (additionalEmailFields.emailFromAddress) {
			body.email_from_address = additionalEmailFields.emailFromAddress;
		}
		if (additionalEmailFields.emailPreheader) {
			body.email_preheader = additionalEmailFields.emailPreheader;
		}
	}

	// SMS specific
	if (targetChannel === 'sms') {
		const smsFrom = this.getNodeParameter('smsFrom', itemIndex, '') as string;
		if (smsFrom) {
			body.sms_from = smsFrom;
		}

		const smsMediaUrls = this.getNodeParameter('smsMediaUrls', itemIndex, '') as string;
		if (smsMediaUrls) {
			body.sms_media_urls = smsMediaUrls.split(',').map((v) => v.trim());
		}
	}

	// Additional options
	const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	if (additionalFields.templateId) {
		body.template_id = additionalFields.templateId;
	}
	if (additionalFields.url) {
		body.url = additionalFields.url;
	}
	if (additionalFields.webUrl) {
		body.web_url = additionalFields.webUrl;
	}
	if (additionalFields.appUrl) {
		body.app_url = additionalFields.appUrl;
	}
	if (additionalFields.bigPicture) {
		body.big_picture = additionalFields.bigPicture;
	}
	if (additionalFields.largeIcon) {
		body.large_icon = additionalFields.largeIcon;
	}
	if (additionalFields.smallIcon) {
		body.small_icon = additionalFields.smallIcon;
	}
	if (additionalFields.iosSound) {
		body.ios_sound = additionalFields.iosSound;
	}
	if (additionalFields.androidSound) {
		body.android_sound = additionalFields.androidSound;
	}
	if (additionalFields.data) {
		try {
			body.data = JSON.parse(additionalFields.data as string);
		} catch {
			body.data = { value: additionalFields.data };
		}
	}
	if (additionalFields.sendAfter) {
		body.send_after = additionalFields.sendAfter;
	}
	if (additionalFields.delayedOption) {
		body.delayed_option = additionalFields.delayedOption;
	}
	if (additionalFields.deliveryTimeOfDay) {
		body.delivery_time_of_day = additionalFields.deliveryTimeOfDay;
	}
	if (additionalFields.ttl !== undefined) {
		body.ttl = additionalFields.ttl;
	}
	if (additionalFields.priority !== undefined) {
		body.priority = additionalFields.priority;
	}
	if (additionalFields.throttleRatePerMinute !== undefined) {
		body.throttle_rate_per_minute = additionalFields.throttleRatePerMinute;
	}
	if (additionalFields.collapseId) {
		body.collapse_id = additionalFields.collapseId;
	}
	if (additionalFields.androidChannelId) {
		body.android_channel_id = additionalFields.androidChannelId;
	}
	if (additionalFields.name) {
		body.name = additionalFields.name;
	}

	// Buttons
	const buttons = this.getNodeParameter('buttons.buttonValues', itemIndex, []) as IDataObject[];
	if (buttons.length > 0) {
		body.buttons = buttons;
	}

	return body;
}

export function buildUserBody(
	this: IExecuteFunctions,
	itemIndex: number,
): IDataObject {
	const body: IDataObject = {};

	// Identity
	const externalId = this.getNodeParameter('externalId', itemIndex, '') as string;
	if (externalId) {
		body.identity = { external_id: externalId };
	}

	// Properties
	const properties: IDataObject = {};

	const tags = this.getNodeParameter('tags.tagValues', itemIndex, []) as IDataObject[];
	if (tags.length > 0) {
		const tagsObj: Record<string, string> = {};
		for (const tag of tags) {
			if (tag.key && tag.value !== undefined) {
				tagsObj[tag.key as string] = tag.value as string;
			}
		}
		if (Object.keys(tagsObj).length > 0) {
			properties.tags = tagsObj;
		}
	}

	const additionalProperties = this.getNodeParameter('additionalProperties', itemIndex, {}) as IDataObject;
	if (additionalProperties.language) {
		properties.language = additionalProperties.language;
	}
	if (additionalProperties.timezone) {
		properties.timezone_id = additionalProperties.timezone;
	}
	if (additionalProperties.country) {
		properties.country = additionalProperties.country;
	}

	if (Object.keys(properties).length > 0) {
		body.properties = properties;
	}

	return body;
}

export function buildSubscriptionBody(
	this: IExecuteFunctions,
	itemIndex: number,
): IDataObject {
	const body: IDataObject = {};

	const subscriptionType = this.getNodeParameter('subscriptionType', itemIndex) as string;
	body.type = subscriptionType;

	const token = this.getNodeParameter('token', itemIndex, '') as string;
	if (token) {
		body.token = token;
	}

	const enabled = this.getNodeParameter('enabled', itemIndex, true) as boolean;
	body.enabled = enabled;

	const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	if (additionalFields.deviceOs) {
		body.device_os = additionalFields.deviceOs;
	}
	if (additionalFields.deviceModel) {
		body.device_model = additionalFields.deviceModel;
	}
	if (additionalFields.appVersion) {
		body.app_version = additionalFields.appVersion;
	}
	if (additionalFields.notificationTypes !== undefined) {
		body.notification_types = additionalFields.notificationTypes;
	}

	return body;
}

export function buildSegmentFilters(
	this: IExecuteFunctions,
	itemIndex: number,
): IDataObject[] {
	const filters: IDataObject[] = [];
	const filterValues = this.getNodeParameter('filters.filterValues', itemIndex, []) as IDataObject[];

	for (const filter of filterValues) {
		const filterObj: IDataObject = {};

		if (filter.field) {
			filterObj.field = filter.field;
		}
		if (filter.key) {
			filterObj.key = filter.key;
		}
		if (filter.value !== undefined) {
			filterObj.value = filter.value;
		}
		if (filter.relation) {
			filterObj.relation = filter.relation;
		}
		if (filter.hoursAgo) {
			filterObj.hours_ago = filter.hoursAgo;
		}
		if (filter.operator) {
			filterObj.operator = filter.operator;
		}

		filters.push(filterObj);
	}

	return filters;
}

export async function getAppId(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
): Promise<string> {
	try {
		const credentials = await this.getCredentials('oneSignalApi');
		return credentials.appId as string;
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			'Could not get App ID from credentials',
		);
	}
}
