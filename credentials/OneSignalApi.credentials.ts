/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OneSignalApi implements ICredentialType {
	name = 'oneSignalApi';
	displayName = 'OneSignal API';
	documentationUrl = 'https://documentation.onesignal.com/reference';
	properties: INodeProperties[] = [
		{
			displayName: 'App ID',
			name: 'appId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your OneSignal App ID found in Keys &amp; IDs settings',
		},
		{
			displayName: 'REST API Key',
			name: 'restApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'REST API Key for server-side operations',
		},
		{
			displayName: 'User Auth Key',
			name: 'userAuthKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'User Auth Key for account-level operations (optional)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Basic {{$credentials.restApiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.onesignal.com',
			url: '=/apps/{{$credentials.appId}}',
			method: 'GET',
		},
	};
}
