# n8n-nodes-onesignal

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for OneSignal, the market-leading push notification platform. This node enables workflow automation for sending push notifications, emails, SMS, managing users and segments, and tracking message analytics.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![OneSignal](https://img.shields.io/badge/OneSignal-integration-E54B4D)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## Features

- **Multi-Channel Messaging**: Send push notifications, emails, and SMS through a unified API
- **Advanced Targeting**: Target users by segments, filters, aliases, or subscription IDs
- **User Management**: Create, update, and manage user profiles with tags and properties
- **Subscription Management**: Handle push, email, and SMS subscriptions across devices
- **Segment Builder**: Create dynamic user segments with 13+ filter types
- **Template Management**: Create and manage reusable notification templates
- **Analytics & Outcomes**: Track notification performance and user engagement
- **Data Export**: Export user and notification data for analysis
- **Webhook Triggers**: React to notification events in real-time
- **Localization Support**: Send messages in multiple languages

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-onesignal`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-onesignal
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-onesignal

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-onesignal

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| App ID | String | Yes | Your OneSignal Application ID |
| REST API Key | Password | Yes | REST API Key for server-side operations |
| User Auth Key | Password | No | User Auth Key for account-level operations |

### Getting Your Credentials

1. Log in to [OneSignal Dashboard](https://onesignal.com)
2. Select your app or create a new one
3. Go to **Settings** > **Keys & IDs**
4. Copy your **App ID** and **REST API Key**
5. For account-level operations, find your **User Auth Key** in account settings

## Resources & Operations

### Notifications

Send and manage multi-channel notifications.

| Operation | Description |
|-----------|-------------|
| Create | Send a new notification (push/email/SMS) |
| Get | Retrieve notification details |
| Get All | List all notifications with pagination |
| Cancel | Cancel a scheduled notification |
| Get History | Get delivery history for a notification |

**Targeting Options:**
- **Segments**: Target predefined user segments
- **Filters**: Use 13+ filter types for precise targeting
- **Aliases**: Target by external_id or custom aliases
- **Subscription IDs**: Target specific device subscriptions

### Users

Manage user profiles and properties.

| Operation | Description |
|-----------|-------------|
| Create | Create a new user |
| Get | Retrieve user details |
| Update | Update user properties and tags |
| Delete | Delete a user |

### Subscriptions

Handle device subscriptions across channels.

| Operation | Description |
|-----------|-------------|
| Create | Create a new subscription |
| Get | Retrieve subscription details |
| Update | Update subscription properties |
| Delete | Delete a subscription |
| Transfer | Transfer subscription to another user |

**Subscription Types:** AndroidPush, iOSPush, ChromeWeb, FirefoxWeb, SafariWeb, Email, SMS, HuaweiPush

### Segments

Create and manage user segments.

| Operation | Description |
|-----------|-------------|
| Create | Create a dynamic segment |
| Get All | List all segments |
| Delete | Delete a segment |

**Available Filter Fields:** last_session, first_session, session_count, session_time, amount_spent, bought_sku, tag, language, app_version, location, country, email, device_type

### Templates

Manage reusable notification templates.

| Operation | Description |
|-----------|-------------|
| Create | Create a new template |
| Get | Retrieve template details |
| Get All | List all templates |
| Update | Update a template |
| Delete | Delete a template |

### Apps

Configure OneSignal applications.

| Operation | Description |
|-----------|-------------|
| Create | Create a new app |
| Get | Retrieve app details |
| Get All | List all apps |
| Update | Update app configuration |

### Outcomes

Track notification analytics.

| Operation | Description |
|-----------|-------------|
| Get | Retrieve outcome data (clicks, sessions, etc.) |

### Export

Export data for analysis.

| Operation | Description |
|-----------|-------------|
| Export Users | Export user data to CSV |
| Export Notifications | Export notification data |

## Trigger Node

The **OneSignal Trigger** node allows you to react to events in real-time via webhooks.

### Supported Events

| Event | Description |
|-------|-------------|
| notification.clicked | User clicked a notification |
| notification.confirmed | Notification was delivered |
| notification.dismissed | User dismissed a notification |
| notification.sent | Notification was sent |
| subscription.changed | User subscription status changed |
| user.updated | User profile was updated |

### Setting Up Webhooks

1. Add the OneSignal Trigger node to your workflow
2. Select the events you want to listen for
3. Activate the workflow to generate a webhook URL
4. Copy the webhook URL to OneSignal Dashboard > Settings > Webhooks

## Usage Examples

### Send Push Notification to Segment

```json
{
  "resource": "notification",
  "operation": "create",
  "targetChannel": "push",
  "targetingType": "segments",
  "segments": ["Active Users"],
  "contentType": "simple",
  "title": "Welcome!",
  "message": "Thanks for using our app!"
}
```

### Send Localized Notification

```json
{
  "resource": "notification",
  "operation": "create",
  "contentType": "localized",
  "localizedContent": [
    { "language": "en", "title": "Hello!", "message": "Welcome to our app" },
    { "language": "es", "title": "¡Hola!", "message": "Bienvenido a nuestra app" },
    { "language": "fr", "title": "Bonjour!", "message": "Bienvenue dans notre app" }
  ]
}
```

### Create User with Tags

```json
{
  "resource": "user",
  "operation": "create",
  "externalId": "user_12345",
  "tags": [
    { "key": "plan", "value": "premium" },
    { "key": "signup_date", "value": "2024-01-15" }
  ],
  "language": "en",
  "timezone": "America/New_York"
}
```

### Create Dynamic Segment

```json
{
  "resource": "segment",
  "operation": "create",
  "name": "High Value Users",
  "filters": [
    { "field": "amount_spent", "relation": ">", "value": "100" },
    { "field": "session_count", "relation": ">", "value": "10" }
  ]
}
```

## Filter Types Reference

| Filter | Description | Operators |
|--------|-------------|-----------|
| last_session | Hours since last active | >, <, =, != |
| first_session | Hours since first seen | >, <, =, != |
| session_count | Total sessions | >, <, =, !=, >=, <= |
| session_time | Total session duration (seconds) | >, <, =, != |
| amount_spent | In-app purchase amount | >, <, =, !=, >=, <= |
| bought_sku | Purchased product SKU | =, != |
| tag | User tag value | >, <, =, !=, exists, not_exists |
| language | Device language | =, != |
| app_version | App version | >, <, =, != |
| location | Geolocation radius | = |
| country | Country code | =, != |
| email | Has email address | = |
| device_type | Platform type | = |

## Error Handling

The node provides detailed error messages for common scenarios:

- **401 Unauthorized**: Invalid API key or insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **429 Rate Limited**: Too many requests, exponential backoff applied
- **400 Bad Request**: Invalid parameters or targeting

## Security Best Practices

1. **Never expose your REST API Key** in client-side code
2. **Use User Auth Key** only for account-level operations
3. **Validate webhook signatures** in production
4. **Limit API key permissions** to only what's needed
5. **Rotate keys regularly** and revoke unused keys

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [OneSignal API Docs](https://documentation.onesignal.com/reference)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-onesignal/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [OneSignal](https://onesignal.com) for their excellent push notification platform
- [n8n](https://n8n.io) for the powerful workflow automation framework
- The n8n community for inspiration and support
