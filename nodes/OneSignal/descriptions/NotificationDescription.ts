/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const notificationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['notification'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a scheduled notification',
				action: 'Cancel a notification',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Send a notification',
				action: 'Create a notification',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get notification details',
				action: 'Get a notification',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many notifications',
				action: 'Get many notifications',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				description: 'Get notification history',
				action: 'Get notification history',
			},
		],
		default: 'create',
	},
];

export const notificationFields: INodeProperties[] = [
	// ----------------------------------
	//         notification: create
	// ----------------------------------
	{
		displayName: 'Target Channel',
		name: 'targetChannel',
		type: 'options',
		options: [
			{ name: 'Push', value: 'push' },
			{ name: 'Email', value: 'email' },
			{ name: 'SMS', value: 'sms' },
		],
		default: 'push',
		required: true,
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
			},
		},
		description: 'The channel to send the notification through',
	},
	{
		displayName: 'Targeting Type',
		name: 'targetingType',
		type: 'options',
		options: [
			{ name: 'Segments', value: 'segments', description: 'Target by user segments' },
			{ name: 'Filters', value: 'filters', description: 'Target by user filters' },
			{ name: 'Aliases', value: 'aliases', description: 'Target by user aliases (external_id)' },
			{ name: 'Subscription IDs', value: 'subscriptionIds', description: 'Target by subscription IDs' },
		],
		default: 'segments',
		required: true,
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
			},
		},
		description: 'How to target users for this notification',
	},
	{
		displayName: 'Included Segments',
		name: 'includedSegments',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getSegments',
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetingType: ['segments'],
			},
		},
		description: 'Segments to include in the notification. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Excluded Segments',
		name: 'excludedSegments',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getSegments',
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetingType: ['segments'],
			},
		},
		description: 'Segments to exclude from the notification. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetingType: ['filters'],
			},
		},
		options: [
			{
				name: 'filterValues',
				displayName: 'Filter',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'options',
						options: [
							{ name: 'Amount Spent', value: 'amount_spent' },
							{ name: 'App Version', value: 'app_version' },
							{ name: 'Bought SKU', value: 'bought_sku' },
							{ name: 'Country', value: 'country' },
							{ name: 'Device Type', value: 'device_type' },
							{ name: 'Email', value: 'email' },
							{ name: 'First Session', value: 'first_session' },
							{ name: 'Language', value: 'language' },
							{ name: 'Last Session', value: 'last_session' },
							{ name: 'Location', value: 'location' },
							{ name: 'Session Count', value: 'session_count' },
							{ name: 'Session Time', value: 'session_time' },
							{ name: 'Tag', value: 'tag' },
						],
						default: 'tag',
					},
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Tag key (only for tag field)',
					},
					{
						displayName: 'Relation',
						name: 'relation',
						type: 'options',
						options: [
							{ name: '=', value: '=' },
							{ name: '!=', value: '!=' },
							{ name: '>', value: '>' },
							{ name: '<', value: '<' },
							{ name: '>=', value: '>=' },
							{ name: '<=', value: '<=' },
							{ name: 'Exists', value: 'exists' },
							{ name: 'Not Exists', value: 'not_exists' },
						],
						default: '=',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Hours Ago',
						name: 'hoursAgo',
						type: 'number',
						default: 0,
						description: 'Hours since event (for time-based fields)',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{ name: 'AND', value: 'AND' },
							{ name: 'OR', value: 'OR' },
						],
						default: 'AND',
						description: 'Logical operator to combine with next filter',
					},
				],
			},
		],
		description: 'Filter conditions to target users',
	},
	{
		displayName: 'Alias Type',
		name: 'aliasType',
		type: 'options',
		options: [
			{ name: 'External ID', value: 'external_id' },
			{ name: 'OneSignal ID', value: 'onesignal_id' },
		],
		default: 'external_id',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetingType: ['aliases'],
			},
		},
	},
	{
		displayName: 'Alias Values',
		name: 'aliasValues',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetingType: ['aliases'],
			},
		},
		description: 'Comma-separated list of alias values to target',
	},
	{
		displayName: 'Subscription IDs',
		name: 'subscriptionIds',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetingType: ['subscriptionIds'],
			},
		},
		description: 'Comma-separated list of subscription IDs to target',
	},
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'options',
		options: [
			{ name: 'Simple', value: 'simple' },
			{ name: 'Localized', value: 'localized' },
		],
		default: 'simple',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['push', 'sms'],
			},
		},
	},
	{
		displayName: 'Heading',
		name: 'heading',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['push'],
				contentType: ['simple'],
			},
		},
		description: 'Notification title',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['push', 'sms'],
				contentType: ['simple'],
			},
		},
		description: 'Notification message content',
	},
	{
		displayName: 'Localized Content',
		name: 'localizedContent',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['push', 'sms'],
				contentType: ['localized'],
			},
		},
		options: [
			{
				name: 'contentValues',
				displayName: 'Content',
				values: [
					{
						displayName: 'Language',
						name: 'language',
						type: 'string',
						default: 'en',
						description: 'Language code (e.g., en, es, fr, zh-Hans)',
					},
					{
						displayName: 'Heading',
						name: 'heading',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Email Subject',
		name: 'emailSubject',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['email'],
			},
		},
	},
	{
		displayName: 'Email Body',
		name: 'emailBody',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['email'],
			},
		},
		description: 'HTML email body content',
	},
	{
		displayName: 'Additional Email Fields',
		name: 'additionalEmailFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['email'],
			},
		},
		options: [
			{
				displayName: 'From Name',
				name: 'emailFromName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'From Address',
				name: 'emailFromAddress',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Preheader',
				name: 'emailPreheader',
				type: 'string',
				default: '',
				description: 'Preview text shown in email clients',
			},
		],
	},
	{
		displayName: 'SMS From',
		name: 'smsFrom',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['sms'],
			},
		},
		description: 'Phone number to send SMS from',
	},
	{
		displayName: 'SMS Media URLs',
		name: 'smsMediaUrls',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['sms'],
			},
		},
		description: 'Comma-separated URLs for MMS media',
	},
	{
		displayName: 'Buttons',
		name: 'buttons',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
				targetChannel: ['push'],
			},
		},
		options: [
			{
				name: 'buttonValues',
				displayName: 'Button',
				values: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: 'Icon',
						name: 'icon',
						type: 'string',
						default: '',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Android Channel ID',
				name: 'androidChannelId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Android Sound',
				name: 'androidSound',
				type: 'string',
				default: '',
			},
			{
				displayName: 'App URL',
				name: 'appUrl',
				type: 'string',
				default: '',
				description: 'Deep link URL for mobile app',
			},
			{
				displayName: 'Big Picture',
				name: 'bigPicture',
				type: 'string',
				default: '',
				description: 'Large image URL for Android',
			},
			{
				displayName: 'Collapse ID',
				name: 'collapseId',
				type: 'string',
				default: '',
				description: 'ID to collapse similar notifications',
			},
			{
				displayName: 'Custom Data',
				name: 'data',
				type: 'string',
				default: '',
				description: 'JSON object of custom data to include',
			},
			{
				displayName: 'Delayed Option',
				name: 'delayedOption',
				type: 'options',
				options: [
					{ name: 'Timezone', value: 'timezone' },
					{ name: 'Last Active', value: 'last-active' },
				],
				default: 'timezone',
			},
			{
				displayName: 'Delivery Time of Day',
				name: 'deliveryTimeOfDay',
				type: 'string',
				default: '',
				description: 'Time of day to deliver (HH:mm format)',
			},
			{
				displayName: 'iOS Sound',
				name: 'iosSound',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Large Icon',
				name: 'largeIcon',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Internal name for the notification',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 10,
				description: 'Delivery priority (1-10)',
			},
			{
				displayName: 'Send After',
				name: 'sendAfter',
				type: 'dateTime',
				default: '',
				description: 'Schedule notification for a specific time (ISO 8601)',
			},
			{
				displayName: 'Small Icon',
				name: 'smallIcon',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Template Name or ID',
				name: 'templateId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTemplates',
				},
				default: '',
				description: 'Use a pre-defined template. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Throttle Rate Per Minute',
				name: 'throttleRatePerMinute',
				type: 'number',
				default: 0,
				description: 'Rate limit notifications per minute',
			},
			{
				displayName: 'TTL',
				name: 'ttl',
				type: 'number',
				default: 259200,
				description: 'Time to live in seconds (default 3 days)',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'URL to open when notification is clicked',
			},
			{
				displayName: 'Web URL',
				name: 'webUrl',
				type: 'string',
				default: '',
				description: 'Web-specific click URL',
			},
		],
	},

	// ----------------------------------
	//         notification: get
	// ----------------------------------
	{
		displayName: 'Notification ID',
		name: 'notificationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['get', 'cancel', 'getHistory'],
			},
		},
	},

	// ----------------------------------
	//         notification: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'notificationFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Kind',
				name: 'kind',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Dashboard', value: 0 },
					{ name: 'API', value: 1 },
					{ name: 'Automated', value: 3 },
				],
				default: '',
				description: 'Filter by notification kind',
			},
		],
	},

	// ----------------------------------
	//         notification: getHistory
	// ----------------------------------
	{
		displayName: 'History Options',
		name: 'historyOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['notification'],
				operation: ['getHistory'],
			},
		},
		options: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Clicked', value: 'clicked' },
					{ name: 'Confirmed', value: 'confirmed' },
					{ name: 'Sent', value: 'sent' },
				],
				default: ['sent'],
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by recipient email',
			},
		],
	},
];
