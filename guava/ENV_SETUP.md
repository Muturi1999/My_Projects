# Environment Variables Setup Guide

## Overview

This project uses environment variables for configuration. You need to create `.env` files in two locations:

1. **Root `.env`** - For backend services (shared by all Django services)
2. **Frontend `.env.local`** - For Next.js frontend application

## Backend Environment File

### Location
Create `.env` file at the **project root** (`/home/mike/My_Projects/guava/.env`)

### Why Root?
All Django services read from the root `.env` file because they use the shared configuration loader that looks for the file at:
```
BASE_DIR / '.env'
```
Where `BASE_DIR` is the project root.

### Setup Steps

1. **Copy the example file:**
   ```bash
   cd /home/mike/My_Projects/guava
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your actual values:
   - Database credentials
   - RabbitMQ connection details
   - Redis connection details
   - Service ports (if different from defaults)

### Key Variables for Backend

- `PRODUCTS_DB_*` - Products service database
- `CATALOG_DB_*` - Catalog service database
- `CMS_DB_*` - CMS service database
- `ORDERS_DB_*` - Orders service database
- `INVENTORY_DB_*` - Inventory service database
- `PROMOTIONS_DB_*` - Promotions service database
- `RABBITMQ_*` - RabbitMQ connection
- `REDIS_*` - Redis connection
- `SECRET_KEY` - Django secret key (change in production!)

## Frontend Environment File

### Location
Create `.env.local` file in the **frontend directory** (`/home/mike/My_Projects/guava/frontend/.env.local`)

### Why `.env.local`?
Next.js automatically loads `.env.local` files and they are git-ignored by default.

### Setup Steps

1. **Copy the example file:**
   ```bash
   cd /home/mike/My_Projects/guava/frontend
   cp .env.example .env.local
   ```

2. **Edit the `.env.local` file** with your actual values:
   - API Gateway URL
   - Application URL

### Key Variables for Frontend

- `NEXT_PUBLIC_APP_URL` - Frontend application URL
- `NEXT_PUBLIC_API_URL` - Backend API URL (through API Gateway)
- `NEXT_PUBLIC_API_GATEWAY_URL` - API Gateway URL
- `NEXT_PUBLIC_DOMAIN` - Domain name

**Note:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Quick Setup Commands

### Backend
```bash
# From project root
cp .env.example .env
# Edit .env with your values
```

### Frontend
```bash
# From project root
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
```

## File Locations Summary

```
guava/
├── .env                    ← Backend services (create this)
├── .env.example            ← Backend template (already exists)
├── frontend/
│   ├── .env.local          ← Frontend (create this)
│   └── .env.example        ← Frontend template (already exists)
└── backend/
    └── ...
```

## Verification

### Check Backend
```bash
# From project root
python -c "from dotenv import load_dotenv; load_dotenv(); import os; print('DB:', os.getenv('PRODUCTS_DB_NAME'))"
```

### Check Frontend
```bash
# From frontend directory
node -e "require('dotenv').config({path: '.env.local'}); console.log('API:', process.env.NEXT_PUBLIC_API_URL)"
```

## Important Notes

1. **Never commit `.env` or `.env.local` files** - They contain sensitive information
2. **Use `.env.example` files** as templates for team members
3. **Change `SECRET_KEY`** in production
4. **Update database passwords** from defaults
5. **Frontend variables** starting with `NEXT_PUBLIC_` are exposed to the browser

## Troubleshooting

### Backend can't find .env
- Make sure `.env` is at the project root (`/home/mike/My_Projects/guava/.env`)
- Check file permissions: `chmod 644 .env`

### Frontend can't read variables
- Make sure file is named `.env.local` (not `.env`)
- Variables must start with `NEXT_PUBLIC_` to be exposed to browser
- Restart Next.js dev server after changing `.env.local`

