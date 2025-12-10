# Backend Services Status & Quick Fix

## Current Status

✅ **Infrastructure (Docker)**: Running
- Databases: All healthy
- Redis: Running
- RabbitMQ: Port conflict (not critical for basic functionality)

⚠️ **API Services**: Need to be started manually

## Quick Fix - Start Required Services

### Option 1: Use the Startup Script (Easiest)

```bash
cd backend
./start_services.sh
```

This will:
1. Check/start Docker services
2. Start API Gateway (port 8000)
3. Start Catalog Service (port 8002)
4. Run migrations
5. Test the services

### Option 2: Manual Start

**Terminal 1 - API Gateway:**
```bash
cd backend/api_gateway
python3 manage.py runserver 8000
```

**Terminal 2 - Catalog Service:**
```bash
cd backend/services/catalog
python3 manage.py migrate  # First time only
python3 manage.py runserver 8002
```

## Verify Services

Test the API Gateway:
```bash
curl http://localhost:8000/api/v1/catalog/queries/categories/
```

You should get a JSON response.

## Frontend Connection

Once both services are running:
1. Refresh your frontend browser
2. Network errors should disappear
3. Categories should load from the API

## Troubleshooting

### Service Not Responding

Check if the service is actually running:
```bash
ps aux | grep "manage.py runserver"
```

Check service logs:
```bash
# For API Gateway
cd backend/api_gateway
python3 manage.py runserver 8000

# For Catalog Service  
cd backend/services/catalog
python3 manage.py runserver 8002
```

### Database Connection Errors

Make sure databases are running:
```bash
cd backend
docker-compose ps
```

All should show "healthy" status.

### Migration Errors

Run migrations:
```bash
cd backend/services/catalog
python3 manage.py migrate
```

## Next Steps

1. ✅ Start infrastructure: `docker-compose up -d`
2. ✅ Start API Gateway: Port 8000
3. ✅ Start Catalog Service: Port 8002
4. ✅ Refresh frontend
5. ✅ Categories should now load!

