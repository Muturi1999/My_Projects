# Backend Status Check

## Current Status

✅ **API Gateway**: Running on port 8000  
❌ **Products Service**: Not running (needs port 8001)  
❓ **Other Services**: Unknown

## Quick Fix

The API Gateway is running, but the Products service is not. To fix:

```bash
# Start Products Service
cd backend/services/products
python manage.py runserver 8001
```

## Full Setup

For complete functionality, start all services:

```bash
# Terminal 1: Products (REQUIRED for product pages)
cd backend/services/products
python manage.py runserver 8001

# Terminal 2: Catalog (REQUIRED for categories/brands)
cd backend/services/catalog
python manage.py runserver 8002

# Terminal 3: CMS (REQUIRED for homepage/navigation)
cd backend/services/cms
python manage.py runserver 8003

# Terminal 4: API Gateway (ALREADY RUNNING)
# cd backend/api_gateway
# python manage.py runserver 8000
```

## Test Backend

```bash
# Test API Gateway
curl http://localhost:8000/api/v1/products/queries/

# Should return JSON (even if empty array)
```

## What Each Service Does

- **Products (8001)**: Product listings, hot deals, product details
- **Catalog (8002)**: Categories, brands, taxonomy
- **CMS (8003)**: Homepage content, navigation, footer
- **Orders (8004)**: Order management (optional for browsing)
- **Inventory (8005)**: Stock management (optional for browsing)
- **Promotions (8006)**: Discounts, coupons (optional for browsing)
- **Reports (8007)**: Analytics (optional for browsing)

## Minimum Required for Frontend

To see the homepage working, you need at least:
1. ✅ API Gateway (port 8000) - **RUNNING**
2. ❌ Products Service (port 8001) - **NOT RUNNING**
3. ❌ Catalog Service (port 8002) - **NEEDED**
4. ❌ CMS Service (port 8003) - **NEEDED**


