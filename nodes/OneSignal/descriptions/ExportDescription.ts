/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const exportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['export'],
			},
		},
		options: [
			{
				name: 'Export Notifications',
				value: 'exportNotifications',
				description: 'Export notification data',
				action: 'Export notifications',
			},
			{
				name: 'Export Users',
				value: 'exportUsers',
				description: 'Export user data',
				action: 'Export users',
			},
		],
		default: 'exportUsers',
	},
];

export const exportFields: INodeProperties[] = [
	// ----------------------------------
	//         export: exportUsers
	// ----------------------------------
	{
		displayName: 'Extra Fields',
		name: 'extraFields',
		type: 'multiOptions',
		options: [
			{ name: 'Device Model', value: 'device_model' },
			{ name: 'Device OS', value: 'device_os' },
			{ name: 'External User ID', value: 'external_user_id' },
			{ name: 'IP Address', value: 'ip' },
			{ name: 'Language', value: 'language' },
			{ name: 'Location', value: 'location' },
			{ name: 'Rooted', value: 'rooted' },
			{ name: 'Timezone', value: 'timezone' },
			{ name: 'Web Auth', value: 'web_auth' },
			{ name: 'Web P256', value: 'web_p256' },
		],
		default: [],
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportUsers'],
			},
		},
		description: 'Additional fields to include in export',
	},
	{
		displayName: 'Segment Name',
		name: 'exportSegmentName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSegments',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportUsers'],
			},
		},
		description: 'Filter export by segment (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//         export: exportNotifications
	// ----------------------------------
	{
		displayName: 'Extra Notification Fields',
		name: 'extraNotificationFields',
		type: 'multiOptions',
		options: [
			{ name: 'Data', value: 'data' },
			{ name: 'Delivery Stats', value: 'delivery_stats' },
			{ name: 'Filters', value: 'filters' },
			{ name: 'Headings', value: 'headings' },
			{ name: 'Include Aliases', value: 'include_aliases' },
			{ name: 'Platform Delivery Stats', value: 'platform_delivery_stats' },
			{ name: 'Received', value: 'received' },
			{ name: 'Send After', value: 'send_after' },
		],
		default: [],
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportNotifications'],
			},
		},
	},
];
