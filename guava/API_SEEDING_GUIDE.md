# API-Based Seeding Guide

This guide explains how to seed your database using the standalone API seeding script, which doesn't require Django management commands.

## Overview

The API seeding approach:
- ✅ Works without Django management commands
- ✅ Only requires services to be running
- ✅ Can be run from anywhere
- ✅ Provides detailed progress and error reporting
- ✅ Handles duplicate data gracefully

## Prerequisites

1. **Exported mock data** (JSON file)
2. **API Gateway running** (port 8000)
3. **All microservices running** (products, catalog, CMS)

## Quick Start

### Step 1: Export Mock Data

```bash
cd frontend
npx --yes tsx scripts/export-mock-data.ts
```

This creates: `backend/data/mock-data-export.json`

### Step 2: Start Services

Make sure all services are running:

```bash
# Option A: Using Docker Compose
cd backend
docker-compose up -d

# Option B: Manual (start each service)
# See backend/SETUP.md for details
```

### Step 3: Test API Connection

```bash
python3 backend/scripts/test_api_endpoints.py
```

Expected output: All endpoints should return `✅` (or at least the API Gateway should be reachable).

### Step 4: Seed Database

```bash
python3 backend/scripts/seed_via_api.py
```

The script will:
1. Load the JSON file
2. Create categories and brands (catalog)
3. Create products (with category/brand relationships)
4. Create CMS content (homepage, navigation, footer, service guarantees)
5. Show a summary with statistics

### Step 5: Verify Data

```bash
# Test endpoints again
python3 backend/scripts/test_api_endpoints.py

# Or use curl
curl http://localhost:8000/api/v1/products/queries/ | jq '.[:3]'
curl http://localhost:8000/api/v1/catalog/queries/categories/ | jq '.[:3]'
```

## Script Options

### Seed Script Options

```bash
# Use custom API URL
python3 backend/scripts/seed_via_api.py --api-url http://localhost:8000/api/v1

# Use custom data file
python3 backend/scripts/seed_via_api.py --data-file path/to/data.json
```

### Test Script Options

```bash
# Test with custom API URL
python3 backend/scripts/test_api_endpoints.py --api-url http://localhost:8000/api/v1
```

## CRUD Operations Demo

After seeding, you can test CRUD operations:

```bash
# Run full CRUD demo (create, read, update, delete)
python3 backend/scripts/demo_crud_operations.py

# Or test individual operations
python3 backend/scripts/demo_crud_operations.py --operation create
python3 backend/scripts/demo_crud_operations.py --operation read
```

## Troubleshooting

### "Connection refused" Error

**Problem:** Services are not running.

**Solution:**
```bash
# Check if services are running
docker-compose ps

# Or check individual services
curl http://localhost:8001/api/v1/products/queries/  # Products service
curl http://localhost:8002/api/v1/catalog/queries/categories/  # Catalog service
```

### "Service unavailable" Error

**Problem:** API Gateway can't reach microservices.

**Solution:**
1. Check service URLs in API Gateway settings
2. Verify services are listening on correct ports
3. Check network connectivity

### Duplicate Data Warnings

**Problem:** Script shows "already exists" warnings.

**Solution:** This is normal if you run the script multiple times. The script will:
- Skip duplicates gracefully
- Try to fetch existing records for relationships
- Continue with remaining data

### Missing Dependencies

**Problem:** `requests` module not found.

**Solution:**
```bash
pip3 install requests
```

## Data Flow

```
Mock Data (TypeScript)
    ↓
Export Script (export-mock-data.ts)
    ↓
JSON File (mock-data-export.json)
    ↓
API Seeding Script (seed_via_api.py)
    ↓
API Gateway (port 8000)
    ↓
Microservices (products, catalog, CMS)
    ↓
PostgreSQL Databases
```

## Next Steps

After successful seeding:

1. **Test API endpoints** - Verify data is accessible
2. **Update frontend** - Gradually integrate API calls (with mock data fallback)
3. **Use CRUD operations** - Edit/update data through API
4. **Monitor services** - Check logs for any issues

## Files Created

- `backend/scripts/seed_via_api.py` - Main seeding script
- `backend/scripts/test_api_endpoints.py` - API testing script
- `backend/scripts/demo_crud_operations.py` - CRUD demonstration
- `backend/data/mock-data-export.json` - Exported mock data

## API Endpoints Used

### Catalog
- `POST /api/v1/catalog/commands/categories/` - Create category
- `POST /api/v1/catalog/commands/brands/` - Create brand
- `GET /api/v1/catalog/queries/categories/` - List categories
- `GET /api/v1/catalog/queries/brands/` - List brands

### Products
- `POST /api/v1/products/commands/` - Create product
- `GET /api/v1/products/queries/` - List products
- `GET /api/v1/products/queries/{id}/` - Get product
- `PATCH /api/v1/products/commands/{id}/` - Update product
- `DELETE /api/v1/products/commands/{id}/` - Delete product

### CMS
- `POST /api/v1/cms/commands/homepage/` - Create homepage
- `POST /api/v1/cms/commands/navigation/` - Create navigation
- `POST /api/v1/cms/commands/footer/` - Create footer
- `POST /api/v1/cms/commands/service-guarantees/` - Create service guarantee

## Summary

The API-based seeding approach provides a flexible way to populate your database without requiring Django management commands. It's perfect for:
- Development environments
- CI/CD pipelines
- Quick data setup
- Testing API endpoints

For production, consider using Django management commands or database migrations for better control and rollback capabilities.

