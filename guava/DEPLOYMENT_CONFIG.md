# Deployment Configuration Guide

## Centralized Domain Configuration

All domain and host configurations are centralized in the `.env` file. When deploying to production, you only need to change the `DOMAIN` variable in one place.

## Backend Configuration

### Location: `/home/mike/My_Projects/guava/.env`

```env
# Domain Configuration (Centralized - change here for production)
# For localhost: DOMAIN=localhost
# For production: DOMAIN=yourdomain.com or DOMAIN=your-ip-address
DOMAIN=localhost
API_GATEWAY_PORT=8000
FRONTEND_PORT=3000
ACCOUNT_SERVICE_PORT=8008
```

### How it works:
- The `DOMAIN` variable is used to build all service URLs automatically
- In production, change `DOMAIN=localhost` to `DOMAIN=yourdomain.com` or `DOMAIN=your-ip-address`
- All service URLs (API Gateway, Products, Catalog, etc.) will automatically use the new domain
- Protocol (http/https) is automatically selected based on environment

## Frontend Configuration

### Location: `/home/mike/My_Projects/guava/frontend/.env.local`

Create this file with:

```env
# Centralized Domain Configuration
# For localhost: NEXT_PUBLIC_DOMAIN=localhost
# For production: NEXT_PUBLIC_DOMAIN=yourdomain.com
NEXT_PUBLIC_DOMAIN=localhost
NEXT_PUBLIC_API_GATEWAY_PORT=8000
NEXT_PUBLIC_FRONTEND_PORT=3000
```

### How it works:
- The `NEXT_PUBLIC_DOMAIN` variable is used to build all API URLs automatically
- URLs are automatically built from the domain and ports
- Protocol (http/https) is automatically selected based on domain

## Database Configuration

### Location: `/home/mike/My_Projects/guava/.env`

```env
# Account Service Database
ACCOUNT_DB_NAME=Guava_Db
ACCOUNT_DB_USER=Mike_admin
ACCOUNT_DB_PASSWORD=Gu@va_@dm!n&#$
ACCOUNT_DB_HOST=localhost
ACCOUNT_DB_PORT=5432
```

**Note:** For production, change `ACCOUNT_DB_HOST=localhost` to your production database server IP or hostname.

## Deployment Steps

### 1. Update Domain in Backend `.env`:
```bash
# Change from:
DOMAIN=localhost

# To:
DOMAIN=yourdomain.com
# OR
DOMAIN=123.456.789.0  # Your server IP
```

### 2. Update Domain in Frontend `.env.local`:
```bash
# Change from:
NEXT_PUBLIC_DOMAIN=localhost

# To:
NEXT_PUBLIC_DOMAIN=yourdomain.com
# OR
NEXT_PUBLIC_DOMAIN=123.456.789.0  # Your server IP
```

### 3. Update Database Host (if needed):
```bash
# In backend .env, change:
ACCOUNT_DB_HOST=localhost

# To:
ACCOUNT_DB_HOST=your-db-server-ip
```

### 4. Set Production Environment:
```bash
# In backend .env:
APP_ENV=production
APP_DEBUG=False

# In frontend .env.local:
APP_ENV=production
```

## Current Configuration Files

### Backend:
- **Main Config**: `backend/shared/config/env.py`
- **API Gateway**: `backend/api_gateway/gateway/settings.py`
- **Account Service**: `backend/services/account/account/settings.py`

### Frontend:
- **Config**: `frontend/lib/config/env.ts`

All these files automatically use the centralized `DOMAIN` configuration from `.env` files.

## Testing Configuration

To verify your configuration is working:

```bash
# Backend
cd backend/services/account
python3 -c "from shared.config.env import get_app_config; c = get_app_config(); print(f'Domain: {c.domain}'); print(f'API Gateway: {c.api_gateway_url}'); print(f'Frontend: {c.frontend_url}')"

# Frontend
cd frontend
npm run build  # Will show any configuration errors
```

