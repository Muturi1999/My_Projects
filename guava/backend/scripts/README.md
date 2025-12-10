# Database Seeding Scripts

This directory contains scripts to seed the database with dummy data from the frontend TypeScript files.

## Available Scripts

### 1. `seed_from_frontend_data.py`
Comprehensive script that seeds all data from the exported JSON file:
- Categories (shop categories, popular categories)
- Brands (popular brands, brand sections)
- Products (hot deals, laptop deals, printer deals, accessories, audio, brand laptops, category products)
- Deals (hot deals from products)

**Usage:**
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

### 2. Service-Specific Seed Commands

#### Catalog Service (Categories & Brands)
```bash
cd backend/services/catalog
python3 manage.py seed_catalog
python3 manage.py seed_catalog --clear
python3 manage.py seed_catalog --dry-run
```

#### Products Service
```bash
cd backend/services/products
python3 manage.py seed_products
python3 manage.py seed_products --clear
python3 manage.py seed_products --dry-run
```

## Prerequisites

1. **Export Frontend Data to JSON:**
   ```bash
   npx ts-node frontend/scripts/export-mock-data.ts
   ```
   This creates `backend/data/mock-data-export.json`

2. **Run Migrations:**
   ```bash
   # Catalog service
   cd backend/services/catalog
   python3 manage.py makemigrations
   python3 manage.py migrate
   
   # Products service
   cd backend/services/products
   python3 manage.py makemigrations
   python3 manage.py migrate
   
   # Promotions service
   cd backend/services/promotions
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

## Data Flow

1. Frontend TypeScript files (`frontend/lib/data/*.ts`)
2. Export script (`frontend/scripts/export-mock-data.ts`)
3. JSON file (`backend/data/mock-data-export.json`)
4. Seed scripts read JSON and populate database

## CRUD Operations

All entities now support full CRUD operations via REST API:

### Categories
- **Create:** `POST /api/catalog/commands/categories/`
- **Read:** `GET /api/catalog/queries/categories/`
- **Update:** `PUT/PATCH /api/catalog/commands/categories/{id}/`
- **Delete:** `DELETE /api/catalog/commands/categories/{id}/` (soft delete)

### Brands
- **Create:** `POST /api/catalog/commands/brands/`
- **Read:** `GET /api/catalog/queries/brands/`
- **Update:** `PUT/PATCH /api/catalog/commands/brands/{id}/`
- **Delete:** `DELETE /api/catalog/commands/brands/{id}/` (soft delete)

### Products
- **Create:** `POST /api/products/commands/`
- **Read:** `GET /api/products/queries/`
- **Update:** `PUT/PATCH /api/products/commands/{id}/`
- **Delete:** `DELETE /api/products/commands/{id}/` (soft delete)

### Deals
- **Create:** `POST /api/promotions/commands/deals/`
- **Read:** `GET /api/promotions/queries/deals/`
- **Update:** `PUT/PATCH /api/promotions/commands/deals/{id}/`
- **Delete:** `DELETE /api/promotions/commands/deals/{id}/` (soft delete)

### Discounts
- **Create:** `POST /api/promotions/commands/discounts/`
- **Read:** `GET /api/promotions/queries/discounts/`
- **Update:** `PUT/PATCH /api/promotions/commands/discounts/{id}/`
- **Delete:** `DELETE /api/promotions/commands/discounts/{id}/` (soft delete)

### Coupons
- **Create:** `POST /api/promotions/commands/coupons/`
- **Read:** `GET /api/promotions/queries/coupons/`
- **Update:** `PUT/PATCH /api/promotions/commands/coupons/{id}/`
- **Delete:** `DELETE /api/promotions/commands/coupons/{id}/` (soft delete)

### Promotional Banners
- **Create:** `POST /api/promotions/commands/banners/`
- **Read:** `GET /api/promotions/queries/banners/`
- **Update:** `PUT/PATCH /api/promotions/commands/banners/{id}/`
- **Delete:** `DELETE /api/promotions/commands/banners/{id}/` (soft delete)

## Notes

- All delete operations are **soft deletes** (sets `is_active=False`)
- Slug uniqueness is validated on create and update
- Products reference categories and brands by slug (not foreign keys)
- Deals reference products by UUID (stored in `product_ids` JSON field)

