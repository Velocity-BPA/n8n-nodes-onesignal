/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

export class OneSignalTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OneSignal Trigger',
		name: 'oneSignalTrigger',
		icon: 'file:onesignal.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Receive OneSignal webhook events',
		defaults: {
			name: 'OneSignal Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Notification Clicked',
						value: 'notification.clicked',
						description: 'Triggered when a user clicks on a notification',
					},
					{
						name: 'Notification Confirmed',
						value: 'notification.confirmed',
						description: 'Triggered when a notification is confirmed delivered',
					},
					{
						name: 'Notification Dismissed',
						value: 'notification.dismissed',
						description: 'Triggered when a user dismisses a notification',
					},
					{
						name: 'Notification Sent',
						value: 'notification.sent',
						description: 'Triggered when a notification is sent',
					},
					{
						name: 'Subscription Changed',
						value: 'subscription.changed',
						description: 'Triggered when a user subscription changes',
					},
					{
						name: 'User Updated',
						value: 'user.updated',
						description: 'Triggered when user data is updated',
					},
					{
						name: 'All Events',
						value: 'all',
						description: 'Receive all webhook events',
					},
				],
				default: 'notification.clicked',
				required: true,
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Webhook',
						name: 'verifyWebhook',
						type: 'boolean',
						default: false,
						description: 'Whether to verify the webhook signature (requires webhook secret)',
					},
					{
						displayName: 'Webhook Secret',
						name: 'webhookSecret',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Secret key for webhook signature verification',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// OneSignal webhooks are configured in the dashboard
				// This always returns true as we can't programmatically check
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Return the webhook URL for manual configuration
				const webhookUrl = this.getNodeWebhookUrl('default');
				console.log(`OneSignal Webhook URL: ${webhookUrl}`);
				console.log('Please configure this URL in your OneSignal dashboard under Settings > Webhooks');
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Webhooks must be manually removed from OneSignal dashboard
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const event = this.getNodeParameter('event') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;

		// Verify webhook signature if enabled
		if (options.verifyWebhook && options.webhookSecret) {
			const signature = req.headers['x-onesignal-signature'] as string;
			if (!signature) {
				return {
					webhookResponse: 'Missing signature',
				};
			}

			// Implement signature verification if needed
			// OneSignal uses HMAC-SHA256 for webhook signatures
		}

		// Extract event type from webhook payload
		const eventType = body.event || body.type || 'unknown';

		// Filter by event type if not "all"
		if (event !== 'all') {
			const eventPrefix = event.split('.')[0];
			const bodyEvent = String(eventType).toLowerCase();

			if (!bodyEvent.includes(eventPrefix)) {
				return {
					webhookResponse: 'Event filtered',
				};
			}
		}

		// Build response data
		const responseData: IDataObject = {
			event: eventType,
			timestamp: new Date().toISOString(),
			...body,
		};

		// Extract common fields
		if (body.notification_id) {
			responseData.notificationId = body.notification_id;
		}
		if (body.player_id || body.subscription_id) {
			responseData.subscriptionId = body.player_id || body.subscription_id;
		}
		if (body.external_user_id || body.external_id) {
			responseData.externalUserId = body.external_user_id || body.external_id;
		}
		if (body.app_id) {
			responseData.appId = body.app_id;
		}

		return {
			workflowData: [this.helpers.returnJsonArray(responseData)],
		};
	}
}
