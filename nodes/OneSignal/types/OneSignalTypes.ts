/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IOneSignalNotification {
	id?: string;
	app_id: string;
	contents?: Record<string, string>;
	headings?: Record<string, string>;
	subtitle?: Record<string, string>;
	template_id?: string;
	target_channel?: 'push' | 'email' | 'sms';
	included_segments?: string[];
	excluded_segments?: string[];
	include_aliases?: Record<string, string[]>;
	include_subscription_ids?: string[];
	filters?: IOneSignalFilter[];
	data?: Record<string, unknown>;
	url?: string;
	web_url?: string;
	app_url?: string;
	big_picture?: string;
	ios_attachments?: Record<string, string>;
	buttons?: IOneSignalButton[];
	send_after?: string;
	delayed_option?: 'timezone' | 'last-active';
	delivery_time_of_day?: string;
	ttl?: number;
	priority?: number;
	throttle_rate_per_minute?: number;
	is_ios?: boolean;
	is_android?: boolean;
	is_any_web?: boolean;
	is_chrome_web?: boolean;
	is_firefox?: boolean;
	is_safari?: boolean;
	is_wp_wns?: boolean;
	is_adm?: boolean;
	is_huawei?: boolean;
	channel_for_external_user_ids?: string;
	name?: string;
	email_subject?: string;
	email_body?: string;
	email_from_name?: string;
	email_from_address?: string;
	sms_from?: string;
	sms_media_urls?: string[];
	android_channel_id?: string;
	android_group?: string;
	android_group_message?: Record<string, string>;
	small_icon?: string;
	large_icon?: string;
	ios_sound?: string;
	android_sound?: string;
	ios_badge_type?: 'None' | 'SetTo' | 'Increase';
	ios_badge_count?: number;
	collapse_id?: string;
	apns_push_type_override?: string;
	thread_id?: string;
	summary_arg?: string;
	summary_arg_count?: number;
	email_preheader?: string;
	include_unsubscribed?: boolean;
}

export interface IOneSignalFilter {
	field?: string;
	key?: string;
	value?: string;
	relation?: '>' | '<' | '=' | '!=' | 'exists' | 'not_exists' | 'time_elapsed_gt' | 'time_elapsed_lt';
	hours_ago?: string;
	radius?: number;
	lat?: number;
	long?: number;
	operator?: 'OR' | 'AND';
}

export interface IOneSignalButton {
	id: string;
	text: string;
	icon?: string;
	url?: string;
}

export interface IOneSignalUser {
	identity?: Record<string, string>;
	properties?: IOneSignalUserProperties;
	subscriptions?: IOneSignalSubscription[];
}

export interface IOneSignalUserProperties {
	tags?: Record<string, string>;
	language?: string;
	timezone_id?: string;
	country?: string;
	first_active?: number;
	last_active?: number;
	amount_spent?: number;
	purchases?: IOneSignalPurchase[];
	ip?: string;
}

export interface IOneSignalPurchase {
	sku: string;
	iso: string;
	amount: string;
	count?: number;
}

export interface IOneSignalSubscription {
	id?: string;
	type: 'AndroidPush' | 'iOSPush' | 'ChromeExtensionPush' | 'ChromePush' | 'FirefoxPush' | 'SafariLegacyPush' | 'Email' | 'SMS';
	token?: string;
	enabled?: boolean;
	notification_types?: number;
	session_time?: number;
	session_count?: number;
	device_os?: string;
	device_model?: string;
	sdk?: string;
	rooted?: boolean;
	test_type?: number;
	app_version?: string;
	net_type?: number;
	carrier?: string;
	web_auth?: string;
	web_p256?: string;
}

export interface IOneSignalSegment {
	id?: string;
	name: string;
	filters?: IOneSignalFilter[];
	created_at?: string;
	updated_at?: string;
	app_id?: string;
}

export interface IOneSignalTemplate {
	id?: string;
	name: string;
	contents?: Record<string, string>;
	headings?: Record<string, string>;
	template_type?: 'push' | 'email' | 'sms';
}

export interface IOneSignalApp {
	id?: string;
	name: string;
	players?: number;
	messageable_players?: number;
	updated_at?: string;
	created_at?: string;
	gcm_key?: string;
	chrome_key?: string;
	chrome_web_origin?: string;
	chrome_web_default_notification_icon?: string;
	chrome_web_sub_domain?: string;
	apns_env?: 'sandbox' | 'production';
	apns_certificates?: string;
	apns_p8?: string;
	apns_team_id?: string;
	apns_key_id?: string;
	apns_bundle_id?: string;
	safari_apns_p12?: string;
	safari_apns_p12_password?: string;
	safari_site_origin?: string;
	safari_push_id?: string;
	safari_icon_16_16?: string;
	safari_icon_32_32?: string;
	safari_icon_64_64?: string;
	safari_icon_128_128?: string;
	safari_icon_256_256?: string;
	site_name?: string;
	basic_auth_key?: string;
	organization_id?: string;
	additional_data_is_root_payload?: boolean;
}

export interface IOneSignalOutcome {
	id: string;
	value: number;
	aggregation: 'sum' | 'count';
}

export interface IOneSignalApiResponse {
	success?: boolean;
	id?: string;
	recipients?: number;
	external_id?: string;
	errors?: string[] | Record<string, string[]>;
	total_count?: number;
	offset?: number;
	limit?: number;
	notifications?: IOneSignalNotification[];
	segments?: IOneSignalSegment[];
	templates?: IOneSignalTemplate[];
	apps?: IOneSignalApp[];
	outcomes?: IOneSignalOutcome[];
}

export interface IOneSignalPaginationOptions {
	limit?: number;
	offset?: number;
	kind?: number;
}

export type OneSignalResource =
	| 'notification'
	| 'user'
	| 'subscription'
	| 'segment'
	| 'template'
	| 'app'
	| 'outcome'
	| 'export';

export type NotificationOperation = 'create' | 'get' | 'getAll' | 'cancel' | 'getHistory';
export type UserOperation = 'create' | 'get' | 'update' | 'delete';
export type SubscriptionOperation = 'create' | 'get' | 'update' | 'delete' | 'transfer';
export type SegmentOperation = 'create' | 'getAll' | 'delete';
export type TemplateOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete';
export type AppOperation = 'get' | 'getAll' | 'create' | 'update';
export type OutcomeOperation = 'get';
export type ExportOperation = 'exportUsers' | 'exportNotifications';
