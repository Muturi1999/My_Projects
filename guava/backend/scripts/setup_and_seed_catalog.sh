#!/bin/bash
# Script to run migrations and seed catalog service
# Run this AFTER creating the catalog_db database

set -e

echo "🌱 Setting up Catalog Service..."
echo ""

cd "$(dirname "$0")/../services/catalog"
source ../../venv/bin/activate
export PYTHONPATH=/home/mike/Desktop/My_Projects/guava/backend:$PYTHONPATH

echo "📦 Running migrations..."
python manage.py migrate --noinput

echo ""
echo "🌾 Seeding categories and brands..."
python manage.py seed_catalog --file ../../data/mock-data-export.json

echo ""
echo "✅ Catalog service setup complete!"

