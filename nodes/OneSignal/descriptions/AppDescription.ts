/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const appOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['app'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new app',
				action: 'Create an app',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get app details',
				action: 'Get an app',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all apps',
				action: 'Get all apps',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an app',
				action: 'Update an app',
			},
		],
		default: 'get',
	},
];

export const appFields: INodeProperties[] = [
	// ----------------------------------
	//         app: create
	// ----------------------------------
	{
		displayName: 'App Name',
		name: 'appName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Platform Settings',
		name: 'platformSettings',
		type: 'collection',
		placeholder: 'Add Platform',
		default: {},
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'iOS Environment',
				name: 'apnsEnv',
				type: 'options',
				options: [
					{ name: 'Sandbox', value: 'sandbox' },
					{ name: 'Production', value: 'production' },
				],
				default: 'sandbox',
			},
			{
				displayName: 'iOS Auth Key (P8)',
				name: 'apnsP8',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'APNs Auth Key content',
			},
			{
				displayName: 'iOS Team ID',
				name: 'apnsTeamId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'iOS Key ID',
				name: 'apnsKeyId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'iOS Bundle ID',
				name: 'apnsBundleId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Android/FCM Server Key',
				name: 'gcmKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
			},
			{
				displayName: 'Chrome Web Origin',
				name: 'chromeWebOrigin',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Chrome Web Default Icon',
				name: 'chromeWebDefaultNotificationIcon',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Safari Site Origin',
				name: 'safariSiteOrigin',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Safari Push ID',
				name: 'safariPushId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Site Name',
				name: 'siteName',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['create'],
			},
		},
		description: 'Organization to create the app under',
	},

	// ----------------------------------
	//         app: get, update
	// ----------------------------------
	{
		displayName: 'App ID',
		name: 'appIdParam',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['get', 'update'],
			},
		},
		description: 'App ID (leave empty to use credentials App ID)',
	},

	// ----------------------------------
	//         app: update
	// ----------------------------------
	{
		displayName: 'Update Name',
		name: 'updateAppName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['update'],
			},
		},
		description: 'New app name (optional)',
	},

	// ----------------------------------
	//         app: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['app'],
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
				resource: ['app'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
