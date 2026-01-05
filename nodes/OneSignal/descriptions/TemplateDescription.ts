/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const templateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['template'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a template',
				action: 'Create a template',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a template',
				action: 'Delete a template',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a template',
				action: 'Get a template',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all templates',
				action: 'Get all templates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a template',
				action: 'Update a template',
			},
		],
		default: 'getAll',
	},
];

export const templateFields: INodeProperties[] = [
	// ----------------------------------
	//         template: create
	// ----------------------------------
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Template Type',
		name: 'templateType',
		type: 'options',
		options: [
			{ name: 'Push', value: 'push' },
			{ name: 'Email', value: 'email' },
			{ name: 'SMS', value: 'sms' },
		],
		default: 'push',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Content Type',
		name: 'templateContentType',
		type: 'options',
		options: [
			{ name: 'Simple', value: 'simple' },
			{ name: 'Localized', value: 'localized' },
		],
		default: 'simple',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create', 'update'],
				templateType: ['push', 'sms'],
			},
		},
	},
	{
		displayName: 'Heading',
		name: 'templateHeading',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create', 'update'],
				templateType: ['push'],
				templateContentType: ['simple'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'templateContent',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create', 'update'],
				templateType: ['push', 'sms'],
				templateContentType: ['simple'],
			},
		},
	},
	{
		displayName: 'Localized Content',
		name: 'templateLocalizedContent',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create', 'update'],
				templateType: ['push', 'sms'],
				templateContentType: ['localized'],
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
						description: 'Language code (e.g., en, es, fr)',
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
		name: 'templateEmailSubject',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create', 'update'],
				templateType: ['email'],
			},
		},
	},
	{
		displayName: 'Email Body',
		name: 'templateEmailBody',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create', 'update'],
				templateType: ['email'],
			},
		},
		description: 'HTML email body content',
	},
	{
		displayName: 'Additional Fields',
		name: 'templateAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Big Picture',
				name: 'bigPicture',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email From Name',
				name: 'emailFromName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email From Address',
				name: 'emailFromAddress',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email Preheader',
				name: 'emailPreheader',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         template: get, update, delete
	// ----------------------------------
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ----------------------------------
	//         template: update
	// ----------------------------------
	{
		displayName: 'Update Name',
		name: 'updateTemplateName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['update'],
			},
		},
		description: 'New template name (optional)',
	},
	{
		displayName: 'Template Type',
		name: 'templateType',
		type: 'options',
		options: [
			{ name: 'Push', value: 'push' },
			{ name: 'Email', value: 'email' },
			{ name: 'SMS', value: 'sms' },
		],
		default: 'push',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['update'],
			},
		},
	},

	// ----------------------------------
	//         template: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['template'],
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
				resource: ['template'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
