/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const outcomeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['outcome'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get notification outcomes/analytics',
				action: 'Get notification outcomes',
			},
		],
		default: 'get',
	},
];

export const outcomeFields: INodeProperties[] = [
	// ----------------------------------
	//         outcome: get
	// ----------------------------------
	{
		displayName: 'Outcome Names',
		name: 'outcomeNames',
		type: 'multiOptions',
		options: [
			{ name: 'Clicked', value: 'os__click' },
			{ name: 'Session Duration', value: 'os__session_duration' },
		],
		required: true,
		default: ['os__click'],
		displayOptions: {
			show: {
				resource: ['outcome'],
				operation: ['get'],
			},
		},
		description: 'Metrics to retrieve',
	},
	{
		displayName: 'Outcome Time Range',
		name: 'outcomeTimeRange',
		type: 'options',
		options: [
			{ name: '1 Hour', value: '1h' },
			{ name: '1 Day', value: '1d' },
			{ name: '1 Month', value: '1mo' },
		],
		default: '1d',
		displayOptions: {
			show: {
				resource: ['outcome'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Outcome Platforms',
		name: 'outcomePlatforms',
		type: 'multiOptions',
		options: [
			{ name: 'iOS', value: '0' },
			{ name: 'Android', value: '1' },
			{ name: 'Amazon Fire', value: '2' },
			{ name: 'Windows Phone', value: '3' },
			{ name: 'Chrome Apps', value: '4' },
			{ name: 'Chrome Web', value: '5' },
			{ name: 'Windows', value: '6' },
			{ name: 'Safari', value: '7' },
			{ name: 'Firefox', value: '8' },
			{ name: 'macOS', value: '9' },
			{ name: 'Alexa', value: '10' },
			{ name: 'Email', value: '11' },
			{ name: 'Huawei', value: '13' },
			{ name: 'SMS', value: '14' },
		],
		default: [],
		displayOptions: {
			show: {
				resource: ['outcome'],
				operation: ['get'],
			},
		},
		description: 'Platforms to filter outcomes by (leave empty for all)',
	},
	{
		displayName: 'Attribution Type',
		name: 'outcomeAttribution',
		type: 'options',
		options: [
			{ name: 'Total', value: 'total' },
			{ name: 'Direct', value: 'direct' },
			{ name: 'Influenced', value: 'influenced' },
			{ name: 'Unattributed', value: 'unattributed' },
		],
		default: 'total',
		displayOptions: {
			show: {
				resource: ['outcome'],
				operation: ['get'],
			},
		},
	},
];
