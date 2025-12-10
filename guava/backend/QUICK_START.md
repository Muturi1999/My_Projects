# Quick Start Guide - Backend Services

## The Problem

You're seeing network errors because the backend services aren't running. The frontend connects to `http://localhost:8000/api/v1` (API Gateway), which then routes to individual services.

## Quick Fix

### Step 1: Start Infrastructure (Databases, Redis, RabbitMQ)

```bash
cd backend
docker-compose up -d
```

Wait about 10-20 seconds for services to be ready. Check status:
```bash
docker-compose ps
```

### Step 2: Start Required Services

**Minimum Required Services:**
- API Gateway (port 8000) - **REQUIRED**
- Catalog Service (port 8002) - **REQUIRED for categories**

**Start API Gateway:**
```bash
cd backend/api_gateway
python3 manage.py runserver 8000
```

**Start Catalog Service (in a new terminal):**
```bash
cd backend/services/catalog
python3 manage.py runserver 8002
```

### Step 3: Verify It's Working

Test the API Gateway:
```bash
curl http://localhost:8000/api/v1/catalog/queries/categories/
```

You should get a JSON response (even if empty).

### Step 4: Refresh Frontend

Once the API Gateway and Catalog service are running, refresh your frontend browser. The network errors should disappear.

## All Services (Optional)

If you need all features, start these services:

```bash
# Terminal 1: API Gateway (REQUIRED)
cd backend/api_gateway
python3 manage.py runserver 8000

# Terminal 2: Products Service
cd backend/services/products
python3 manage.py runserver 8001

# Terminal 3: Catalog Service (REQUIRED for categories)
cd backend/services/catalog
python3 manage.py runserver 8002

# Terminal 4: CMS Service
cd backend/services/cms
python3 manage.py runserver 8003

# Terminal 5: Orders Service
cd backend/services/orders
python3 manage.py runserver 8004

# Terminal 6: Inventory Service
cd backend/services/inventory
python3 manage.py runserver 8005

# Terminal 7: Promotions Service
cd backend/services/promotions
python3 manage.py runserver 8006

# Terminal 8: Reports Service
cd backend/services/reports
python3 manage.py runserver 8007
```

## Troubleshooting

### Port Already in Use

If a port is already in use:
```bash
# Find what's using the port
lsof -i :8000

# Kill the process or use a different port
```

### Database Connection Errors

Make sure databases are running:
```bash
docker-compose ps
```

All database containers should show "healthy" status.

### Service Not Starting

Check for Python dependencies:
```bash
cd backend/shared
pip install -r requirements.txt

cd ../services/catalog
pip install -r requirements.txt
```

## Development Workflow

1. **Start Infrastructure**: `cd backend && docker-compose up -d`
2. **Start API Gateway**: `cd backend/api_gateway && python3 manage.py runserver 8000`
3. **Start Catalog Service**: `cd backend/services/catalog && python3 manage.py runserver 8002`
4. **Start Frontend**: `cd frontend && npm run dev`
5. **Access**: http://localhost:3000

## Note

For category management, you only need:
- ✅ API Gateway (port 8000)
- ✅ Catalog Service (port 8002)
- ✅ Databases running (via docker-compose)

The frontend will work with just these services running.

