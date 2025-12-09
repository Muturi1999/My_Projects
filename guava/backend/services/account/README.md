# Account Service

This is the account management microservice for the Guava Stores platform. It handles user and admin authentication, registration, profile management, and related operations.

## Features

### User Management
- User registration with email or phone
- User login (email or phone)
- Social login (Google, Apple, Facebook)
- Email/Phone verification
- Password reset flow
- Profile management
- Address management

### Admin Management
- Admin login (separate from user login)
- Admin profile management
- Role-based access control

### Security
- Token-based authentication
- Session management
- Password validation
- Verification codes for email/phone
- Secure password reset tokens

## API Endpoints

### Commands (Write Operations)

#### User Registration
- `POST /api/account/commands/register/` - Register a new user

#### User Authentication
- `POST /api/account/commands/login/login/` - User login
- `POST /api/account/commands/login/logout/` - User logout
- `POST /api/account/commands/admin/login/login/` - Admin login
- `POST /api/account/commands/social/login/login/` - Social login

#### Verification
- `POST /api/account/commands/verify/verify/` - Verify email/phone code
- `POST /api/account/commands/verify/resend/` - Resend verification code

#### Password Reset
- `POST /api/account/commands/password-reset/request/` - Request password reset
- `POST /api/account/commands/password-reset/verify/` - Verify reset code
- `POST /api/account/commands/password-reset/reset/` - Reset password

#### Profile Management
- `GET /api/account/commands/profile/profile/` - Get user profile
- `PUT /api/account/commands/profile/profile/` - Update user profile
- `PATCH /api/account/commands/profile/profile/` - Partially update user profile
- `POST /api/account/commands/profile/change-password/` - Change password

#### Address Management
- `GET /api/account/commands/addresses/` - List user addresses
- `POST /api/account/commands/addresses/` - Create address
- `GET /api/account/commands/addresses/{id}/` - Get address
- `PUT /api/account/commands/addresses/{id}/` - Update address
- `PATCH /api/account/commands/addresses/{id}/` - Partially update address
- `DELETE /api/account/commands/addresses/{id}/` - Delete address

#### Admin Management
- `GET /api/account/commands/admins/` - List admins (superuser only)
- `POST /api/account/commands/admins/` - Create admin (superuser only)
- `GET /api/account/commands/admins/{id}/` - Get admin (superuser only)
- `PUT /api/account/commands/admins/{id}/` - Update admin (superuser only)
- `DELETE /api/account/commands/admins/{id}/` - Delete admin (superuser only)

### Queries (Read Operations)

#### User Queries
- `GET /api/account/queries/users/` - List users (admin only)
- `GET /api/account/queries/users/{id}/` - Get user (admin only)
- `GET /api/account/queries/users/{id}/profile/` - Get user profile (admin only)

#### Address Queries
- `GET /api/account/queries/addresses/` - List user addresses
- `GET /api/account/queries/addresses/{id}/` - Get address
- `GET /api/account/queries/addresses/default/` - Get default address

#### Admin Queries
- `GET /api/account/queries/admins/` - List admins (admin only)
- `GET /api/account/queries/admins/{id}/` - Get admin (admin only)

## Models

### User
- Custom user model supporting email or phone authentication
- Social login integration (Google, Apple, Facebook)
- Email and phone verification
- Profile information

### Admin
- Separate admin profile linked to User
- Role-based permissions
- Department assignment

### Address
- Multiple addresses per user
- Default address support
- Full address details

### VerificationCode
- 6-digit verification codes
- Email/phone verification
- Password reset codes
- Expiry management

### PasswordResetToken
- Secure token-based password reset
- Expiry management

### UserSession
- Session tracking
- Device information
- IP address logging

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure database in `.env`:
```
ACCOUNT_DB_NAME=account_db
ACCOUNT_DB_USER=postgres
ACCOUNT_DB_PASSWORD=password
ACCOUNT_DB_HOST=localhost
ACCOUNT_DB_PORT=5432
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run server:
```bash
python manage.py runserver 8008
```

## Environment Variables

- `ACCOUNT_DB_NAME` - Database name
- `ACCOUNT_DB_USER` - Database user
- `ACCOUNT_DB_PASSWORD` - Database password
- `ACCOUNT_DB_HOST` - Database host
- `ACCOUNT_DB_PORT` - Database port
- `EMAIL_HOST` - SMTP host for sending emails
- `EMAIL_PORT` - SMTP port
- `EMAIL_HOST_USER` - SMTP username
- `EMAIL_HOST_PASSWORD` - SMTP password
- `SMS_PROVIDER` - SMS provider (console, twilio, etc.)
- `SMS_API_KEY` - SMS API key
- `SMS_API_SECRET` - SMS API secret

## Authentication

The service uses Token Authentication. Include the token in the Authorization header:
```
Authorization: Token <token>
```

## Notes

- Verification codes are currently returned in API responses for development. In production, these should be sent via email/SMS.
- Social login requires proper OAuth configuration.
- Email and SMS sending need to be configured for production use.

