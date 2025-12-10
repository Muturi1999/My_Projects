# Database Seeding and CRUD Operations Guide

## Overview

This guide explains how to seed all dummy data from the frontend TypeScript files into the database and use the enhanced CRUD operations.

## What Has Been Implemented

### 1. Enhanced CRUD Operations

All entities now support full CRUD (Create, Read, Update, Delete) operations:

#### Categories (`/api/catalog/commands/categories/`)
- ✅ **Create:** `POST` - Create new category
- ✅ **Read:** `GET /api/catalog/queries/categories/` - List all categories
- ✅ **Update:** `PUT/PATCH` - Update category (validates slug uniqueness)
- ✅ **Delete:** `DELETE` - Soft delete (sets `is_active=False`)

#### Brands (`/api/catalog/commands/brands/`)
- ✅ **Create:** `POST` - Create new brand
- ✅ **Read:** `GET /api/catalog/queries/brands/` - List all brands
- ✅ **Update:** `PUT/PATCH` - Update brand (validates slug uniqueness)
- ✅ **Delete:** `DELETE` - Soft delete

#### Products (`/api/products/commands/`)
- ✅ **Create:** `POST` - Create new product
- ✅ **Read:** `GET /api/products/queries/` - List all products
- ✅ **Update:** `PUT/PATCH` - Update product
- ✅ **Delete:** `DELETE` - Soft delete

#### Deals (`/api/promotions/commands/deals/`)
- ✅ **Create:** `POST` - Create new deal
- ✅ **Read:** `GET /api/promotions/queries/deals/` - List all deals
- ✅ **Update:** `PUT/PATCH` - Update deal (validates slug uniqueness)
- ✅ **Delete:** `DELETE` - Soft delete

#### Discounts, Coupons, Promotional Banners
- ✅ Full CRUD operations for all promotion entities

### 2. New Deal Model

A new `Deal` model has been added to the promotions service to manage:
- Hot deals
- Featured deals
- Flash sales
- Seasonal deals

The model includes:
- Product references (by UUID)
- Category and brand filtering
- Discount information
- Validity dates
- Visual elements (images, badges)

### 3. Comprehensive Seed Scripts

#### Main Seed Script: `backend/scripts/seed_from_frontend_data.py`

This script seeds all data from the exported JSON file:

```bash
# Seed all data
python3 backend/scripts/seed_from_frontend_data.py

# Clear existing data and seed fresh
python3 backend/scripts/seed_from_frontend_data.py --clear

# Preview what will be created (dry run)
python3 backend/scripts/seed_from_frontend_data.py --dry-run

# Seed only specific sections
python3 backend/scripts/seed_from_frontend_data.py --categories-only
python3 backend/scripts/seed_from_frontend_data.py --brands-only
python3 backend/scripts/seed_from_frontend_data.py --products-only
python3 backend/scripts/seed_from_frontend_data.py --deals-only
```

#### Service-Specific Seed Commands

**Catalog Service:**
```bash
cd backend/services/catalog
python3 manage.py seed_catalog
python3 manage.py seed_catalog --clear
```

**Products Service:**
```bash
cd backend/services/products
python3 manage.py seed_products
python3 manage.py seed_products --clear
```

## Setup Instructions

### 1. Export Frontend Data

First, export the frontend TypeScript data to JSON:

```bash
npx ts-node frontend/scripts/export-mock-data.ts
```

This creates `backend/data/mock-data-export.json`

### 2. Run Migrations

Run migrations for all services:

```bash
# Catalog service
cd backend/services/catalog
python3 manage.py makemigrations
python3 manage.py migrate

# Products service
cd backend/services/products
python3 manage.py makemigrations
python3 manage.py migrate

# Promotions service (includes new Deal model)
cd backend/services/promotions
python3 manage.py makemigrations
python3 manage.py migrate
```

### 3. Seed the Database

```bash
# Seed all data at once
python3 backend/scripts/seed_from_frontend_data.py --clear
```

Or seed services individually:

```bash
# Seed catalog (categories and brands)
cd backend/services/catalog
python3 manage.py seed_catalog --clear

# Seed products
cd backend/services/products
python3 manage.py seed_products --clear
```

## Data Flow

```
Frontend TypeScript Files
    ↓
export-mock-data.ts
    ↓
mock-data-export.json
    ↓
Seed Scripts
    ↓
Database
```

## API Endpoints

### Catalog Service

**Categories:**
- `POST /api/catalog/commands/categories/` - Create
- `GET /api/catalog/queries/categories/` - List
- `GET /api/catalog/queries/categories/{id}/` - Retrieve
- `PUT /api/catalog/commands/categories/{id}/` - Update
- `PATCH /api/catalog/commands/categories/{id}/` - Partial update
- `DELETE /api/catalog/commands/categories/{id}/` - Delete

**Brands:**
- `POST /api/catalog/commands/brands/` - Create
- `GET /api/catalog/queries/brands/` - List
- `GET /api/catalog/queries/brands/{id}/` - Retrieve
- `PUT /api/catalog/commands/brands/{id}/` - Update
- `PATCH /api/catalog/commands/brands/{id}/` - Partial update
- `DELETE /api/catalog/commands/brands/{id}/` - Delete

### Products Service

- `POST /api/products/commands/` - Create
- `GET /api/products/queries/` - List
- `GET /api/products/queries/{id}/` - Retrieve
- `PUT /api/products/commands/{id}/` - Update
- `PATCH /api/products/commands/{id}/` - Partial update
- `DELETE /api/products/commands/{id}/` - Delete

### Promotions Service

**Deals:**
- `POST /api/promotions/commands/deals/` - Create
- `GET /api/promotions/queries/deals/` - List
- `GET /api/promotions/queries/deals/{id}/` - Retrieve
- `PUT /api/promotions/commands/deals/{id}/` - Update
- `PATCH /api/promotions/commands/deals/{id}/` - Partial update
- `DELETE /api/promotions/commands/deals/{id}/` - Delete

## Important Notes

1. **Soft Deletes:** All delete operations are soft deletes (sets `is_active=False`)
2. **Slug Uniqueness:** Slug uniqueness is validated on create and update
3. **Product References:** Products reference categories and brands by slug (not foreign keys)
4. **Deal References:** Deals reference products by UUID (stored in `product_ids` JSON field)
5. **Data Relationships:** 
   - Products → Categories (by slug)
   - Products → Brands (by slug)
   - Deals → Products (by UUID list)

## Troubleshooting

### Import Errors

If you encounter `ModuleNotFoundError: No module named 'shared'`, ensure:
1. You're running commands from the correct directory
2. The `backend/shared` directory exists
3. The path setup in `manage.py` is correct

### Database Connection Errors

Ensure:
1. PostgreSQL is running
2. Database credentials in `.env` are correct
3. Databases are created for each service

### Seed Script Errors

1. Ensure `mock-data-export.json` exists (run export script first)
2. Check that migrations have been run
3. Verify database connections

## Next Steps

1. **Run Migrations:** Create database tables for all services
2. **Seed Data:** Run seed scripts to populate database
3. **Test APIs:** Use the API endpoints to verify CRUD operations
4. **Integrate Frontend:** Update frontend to use API endpoints instead of local data

