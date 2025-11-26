# Quick Start: Backend Services

## The Issue

You're seeing "Network Error" because the backend API Gateway is not running. The frontend is trying to connect to `http://localhost:8000/api/v1` but nothing is listening there.

## Quick Fix: Start the Backend

### Option 1: Docker Compose (Easiest - Recommended)

This starts all infrastructure (databases, RabbitMQ, Redis):

```bash
# 1. Start infrastructure
cd backend
docker-compose up -d

# 2. Wait for services to be ready (about 10-20 seconds)
docker-compose ps

# 3. Run migrations for each service (one-time setup)
cd backend/services/products && python manage.py migrate
cd ../catalog && python manage.py migrate
cd ../cms && python manage.py migrate
cd ../orders && python manage.py migrate
cd ../inventory && python manage.py migrate
cd ../promotions && python manage.py migrate
cd ../reports && python manage.py migrate

# 4. Start API Gateway (this is what the frontend connects to)
cd ../../api_gateway
python manage.py runserver 8000
```

### Option 2: Start Services Manually

If you prefer to start services individually:

```bash
# Terminal 1: Products Service
cd backend/services/products
python manage.py runserver 8001

# Terminal 2: Catalog Service
cd backend/services/catalog
python manage.py runserver 8002

# Terminal 3: CMS Service
cd backend/services/cms
python manage.py runserver 8003

# Terminal 4: Orders Service
cd backend/services/orders
python manage.py runserver 8004

# Terminal 5: Inventory Service
cd backend/services/inventory
python manage.py runserver 8005

# Terminal 6: Promotions Service
cd backend/services/promotions
python manage.py runserver 8006

# Terminal 7: Reports Service
cd backend/services/reports
python manage.py runserver 8007

# Terminal 8: API Gateway (REQUIRED - Frontend connects here)
cd backend/api_gateway
python manage.py runserver 8000
```

## Verify Backend is Running

Test the API Gateway:

```bash
curl http://localhost:8000/api/v1/products/queries/
```

You should get a JSON response (even if empty).

## Frontend Will Work Once Backend is Running

Once the API Gateway is running on port 8000, refresh your frontend and the network errors will disappear.

## Troubleshooting

### Port 8000 Already in Use

If port 8000 is already in use:

```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process or use a different port
# Update frontend/.env.local:
# NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8001/api/v1
```

### Database Connection Errors

Make sure PostgreSQL is running:

```bash
# With Docker Compose
docker-compose ps

# Or check PostgreSQL directly
psql -U postgres -h localhost -p 5432
```

### Missing Dependencies

Install Python dependencies:

```bash
cd backend/shared
pip install -r requirements.txt

cd ../services/products
pip install -r requirements.txt
# Repeat for other services...
```

## Development Workflow

1. **Start Infrastructure**: `cd backend && docker-compose up -d`
2. **Start API Gateway**: `cd backend/api_gateway && python manage.py runserver 8000`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Access**: http://localhost:3000

## Note

For development, you only need:
- ✅ API Gateway (port 8000) - **REQUIRED**
- ✅ At least one service (e.g., Products) - **REQUIRED**
- ✅ PostgreSQL databases - **REQUIRED**
- ⚠️ RabbitMQ & Redis - Optional for basic functionality

The frontend will work with just the API Gateway and one service running, though some features may not work without all services.


