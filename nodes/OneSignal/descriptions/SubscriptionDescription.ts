/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const subscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a subscription for a user',
				action: 'Create a subscription',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a subscription',
				action: 'Delete a subscription',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get subscription details',
				action: 'Get a subscription',
			},
			{
				name: 'Transfer',
				value: 'transfer',
				description: 'Transfer a subscription to another user',
				action: 'Transfer a subscription',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a subscription',
				action: 'Update a subscription',
			},
		],
		default: 'get',
	},
];

export const subscriptionFields: INodeProperties[] = [
	// ----------------------------------
	//         subscription: create
	// ----------------------------------
	{
		displayName: 'User Alias Type',
		name: 'userAliasType',
		type: 'options',
		options: [
			{ name: 'External ID', value: 'external_id' },
			{ name: 'OneSignal ID', value: 'onesignal_id' },
		],
		default: 'external_id',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'User Alias Value',
		name: 'userAliasValue',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		description: 'The user to create the subscription for',
	},
	{
		displayName: 'Subscription Type',
		name: 'subscriptionType',
		type: 'options',
		required: true,
		options: [
			{ name: 'Android Push', value: 'AndroidPush' },
			{ name: 'Chrome Extension Push', value: 'ChromeExtensionPush' },
			{ name: 'Chrome Push', value: 'ChromePush' },
			{ name: 'Email', value: 'Email' },
			{ name: 'Firefox Push', value: 'FirefoxPush' },
			{ name: 'iOS Push', value: 'iOSPush' },
			{ name: 'Safari Legacy Push', value: 'SafariLegacyPush' },
			{ name: 'SMS', value: 'SMS' },
		],
		default: 'Email',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		description: 'Device token, email address, or phone number depending on type',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create', 'update'],
			},
		},
		description: 'Whether the subscription is enabled',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'App Version',
				name: 'appVersion',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Device Model',
				name: 'deviceModel',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Device OS',
				name: 'deviceOs',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Notification Types',
				name: 'notificationTypes',
				type: 'number',
				default: -2,
				description: 'Bitmask of enabled notification types (-2 = subscribed)',
			},
		],
	},

	// ----------------------------------
	//         subscription: get, update, delete
	// ----------------------------------
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// ----------------------------------
	//         subscription: update
	// ----------------------------------
	{
		displayName: 'Update Token',
		name: 'updateToken',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['update'],
			},
		},
		description: 'New token value (optional)',
	},

	// ----------------------------------
	//         subscription: transfer
	// ----------------------------------
	{
		displayName: 'Subscription ID',
		name: 'transferSubscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['transfer'],
			},
		},
	},
	{
		displayName: 'Target User Alias Type',
		name: 'targetAliasType',
		type: 'options',
		options: [
			{ name: 'External ID', value: 'external_id' },
			{ name: 'OneSignal ID', value: 'onesignal_id' },
		],
		default: 'external_id',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['transfer'],
			},
		},
	},
	{
		displayName: 'Target User Alias Value',
		name: 'targetAliasValue',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['transfer'],
			},
		},
		description: 'The user to transfer the subscription to',
	},
];
