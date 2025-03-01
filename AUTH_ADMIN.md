# Airsoft Backend

## Admin Authentication Guide

This document provides instructions for setting up and using the admin authentication system.

### Overview

The admin authentication system uses Google OAuth 2.0 for secure login. Only email addresses listed in the admin whitelist can access protected endpoints. Authentication flow:

1. Admin initiates Google login
2. After successful Google authentication, the server verifies if the email is in the admin whitelist
3. If authorized, a JWT token is issued
4. The JWT token must be included in subsequent API calls to access protected endpoints

### Prerequisites

1. Google account with access to Google Cloud Console
2. Node.js and npm installed
3. Environment variables configured

### Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as application type
6. Add the following Authorized redirect URI: `http://localhost:3113/admin/google/callback`
7. Click "Create" and note your Client ID and Client Secret

### Environment Configuration

Create a `.env` file in the root of your project with the following variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3113/admin/google/callback
JWT_SECRET=your_secure_random_string
MONGODB_URI=mongodb://localhost:27017/airsoft
```

### Admin Authentication Flow

#### 1. Initiate Authentication

Direct the admin to the Google authentication URL:

```
GET /admin/google
```

This will redirect to Google's login page.

#### 2. Handle Callback

After successful Google login, Google will redirect to:

```
GET /admin/google/callback
```

If the user's email is in the admin whitelist, they will be redirected to:

```
/admin/dashboard?token=YOUR_JWT_TOKEN
```

The frontend should extract and store this token for subsequent requests.

#### 3. Verify Token (Optional)

To verify if a token is valid:

```
GET /admin/verify-token

Body:
{
  "token": "YOUR_JWT_TOKEN"
}
```

Response:
```json
{
  "email": "admin@example.com",
  "isAdmin": true,
  "iat": 1623456789,
  "exp": 1623543189
}
```

### Using Protected Endpoints

For all protected admin endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Example of creating a new game:

```
POST /admin/create-game
Authorization: Bearer YOUR_JWT_TOKEN

Body:
{
  "id": 5,
  "name": "Operation Thunder",
  "date": "December 15, 2023",
  "location": "Forest Base, Kyiv",
  "coordinates": "50.4501,30.5234",
  "description": "A winter operation with challenging weather conditions.",
  "image": "https://example.com/image.jpg",
  "capacity": {
    "total": 40,
    "filled": 0
  },
  "price": 85,
  "status": "upcoming"
}
```

### Admin API Endpoints

| Endpoint | Method | Description | Protected |
|----------|--------|-------------|-----------|
| /admin/google | GET | Initiate Google OAuth login | No |
| /admin/google/callback | GET | Handle OAuth callback | No |
| /admin/verify-token | GET | Verify JWT token | No |
| /admin/create-game | POST | Create a new game | Yes |
| /admin/login-failed | GET | Login failure endpoint | No |

### Token Management

- Tokens expire after 24 hours
- Store tokens securely in the frontend (e.g., HttpOnly cookies or secure local storage)
- For security, don't store tokens in local storage in production environments

### Frontend Implementation Tips

1. Redirect users to `/admin/google` for login
2. After redirect to `/admin/dashboard?token=YOUR_JWT_TOKEN`, extract token from URL
3. Store token securely
4. Include token in all API requests to protected endpoints
5. Implement a logout feature by removing the token
6. Handle token expiration gracefully

### Troubleshooting

- **403 Unauthorized**: Email not in admin whitelist
- **401 Unauthorized**: Missing or invalid JWT token
- **Token verification fails**: Token expired or tampered

For security issues or questions, contact the system administrator.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
