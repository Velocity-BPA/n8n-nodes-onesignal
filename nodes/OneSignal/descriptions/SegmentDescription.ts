/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const segmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['segment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a segment',
				action: 'Create a segment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a segment',
				action: 'Delete a segment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all segments',
				action: 'Get all segments',
			},
		],
		default: 'getAll',
	},
];

export const segmentFields: INodeProperties[] = [
	// ----------------------------------
	//         segment: create
	// ----------------------------------
	{
		displayName: 'Segment Name',
		name: 'segmentName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['create'],
			},
		},
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
				resource: ['segment'],
				operation: ['create'],
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
							{ name: 'Time Elapsed >', value: 'time_elapsed_gt' },
							{ name: 'Time Elapsed <', value: 'time_elapsed_lt' },
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
							{ name: 'None', value: '' },
							{ name: 'AND', value: 'AND' },
							{ name: 'OR', value: 'OR' },
						],
						default: '',
						description: 'Logical operator to combine with next filter',
					},
				],
			},
		],
		description: 'Filter conditions to define the segment',
	},

	// ----------------------------------
	//         segment: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['segment'],
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
				resource: ['segment'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         segment: delete
	// ----------------------------------
	{
		displayName: 'Segment ID',
		name: 'segmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['delete'],
			},
		},
	},
];
