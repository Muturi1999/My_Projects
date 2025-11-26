# Quick Start: Mock Data Migration

## 🚀 Fast Track (5 Minutes)

### 1. Export Mock Data
```bash
cd frontend
npx ts-node scripts/export-mock-data.ts
```

### 2. Seed Database (in order)
```bash
# Catalog first (categories & brands)
cd backend/services/catalog
python manage.py seed_catalog --clear

# Then products
cd ../products
python manage.py seed_products --clear

# Finally CMS
cd ../cms
python manage.py seed_cms --clear
```

### 3. Verify
```bash
# Test API
curl http://localhost:8000/api/v1/products/queries/ | head -20
```

## ✅ Done!

Your mock data is now in the database. Frontend remains unchanged.

## 🔄 To Revert

Simply clear the database and re-seed:
```bash
python manage.py seed_products --clear
python manage.py seed_catalog --clear
python manage.py seed_cms --clear
```

## 📚 Full Guide

See `MOCK_DATA_MIGRATION_GUIDE.md` for detailed instructions.

