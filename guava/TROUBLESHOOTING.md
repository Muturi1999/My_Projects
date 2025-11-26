# Troubleshooting Guide

## Internal Server Error

### Common Causes and Solutions

#### 1. Missing .env File

**Symptom:** Internal server error when accessing API Gateway

**Solution:**
```bash
# Create .env file from template
cd /home/mike/My_Projects/guava
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

#### 2. Services Not Running

**Symptom:** 503 Service Unavailable or Connection Error

**Check if services are running:**
```bash
# Check if services are listening on their ports
netstat -tuln | grep -E "800[0-7]"

# Or using ss
ss -tuln | grep -E "800[0-7]"
```

**Start services:**
```bash
# Products service
cd backend/services/products
python manage.py runserver 8001

# Catalog service
cd backend/services/catalog
python manage.py runserver 8002

# CMS service
cd backend/services/cms
python manage.py runserver 8003

# Orders service
cd backend/services/orders
python manage.py runserver 8004

# Inventory service
cd backend/services/inventory
python manage.py runserver 8005

# Promotions service
cd backend/services/promotions
python manage.py runserver 8006

# API Gateway
cd backend/api_gateway
python manage.py runserver 8000
```

#### 3. Database Connection Issues

**Symptom:** Database errors in service logs

**Check Docker containers:**
```bash
cd backend
docker-compose ps
```

**Start databases:**
```bash
cd backend
docker-compose up -d
```

**Check database connectivity:**
```bash
# Test Products database
psql -h localhost -p 5432 -U postgres -d products_db

# If connection fails, check docker-compose.yml and .env file
```

#### 4. Missing Dependencies

**Symptom:** ImportError or ModuleNotFoundError

**Install dependencies:**
```bash
# Install shared dependencies
cd backend/shared
pip install -r requirements.txt

# Install service dependencies
cd ../services/products
pip install -r requirements.txt

# Repeat for each service
```

#### 5. Port Conflicts

**Symptom:** "Address already in use" error

**Find process using port:**
```bash
# Find process on port 8000
lsof -i :8000
# or
netstat -tulpn | grep 8000

# Kill the process
kill -9 <PID>
```

#### 6. Python Path Issues

**Symptom:** ImportError for shared modules

**Solution:** Make sure you're running from the correct directory and Python path is set correctly.

**Check Python path:**
```bash
cd backend/services/products
python -c "import sys; print('\n'.join(sys.path))"
```

## Debugging Steps

### 1. Enable Debug Mode

In `.env` file:
```env
APP_DEBUG=true
```

In Django settings, make sure:
```python
DEBUG = os.getenv('APP_DEBUG', 'True') == 'True'
```

### 2. Check Logs

**API Gateway logs:**
```bash
cd backend/api_gateway
python manage.py runserver 8000
# Check console output for errors
```

**Service logs:**
```bash
cd backend/services/products
python manage.py runserver 8001
# Check console output for errors
```

### 3. Test API Gateway Directly

```bash
# Test if API Gateway is running
curl http://localhost:8000/api/v1/products/queries/

# Should return JSON response or error message
```

### 4. Test Services Directly

```bash
# Test Products service directly
curl http://localhost:8001/api/v1/products/queries/

# Test Catalog service directly
curl http://localhost:8002/api/v1/catalog/queries/categories/
```

### 5. Check Environment Variables

```bash
# Verify .env file exists
ls -la /home/mike/My_Projects/guava/.env

# Check if variables are loaded
cd backend/api_gateway
python manage.py shell
>>> import os
>>> from dotenv import load_dotenv
>>> load_dotenv()
>>> print(os.getenv('PRODUCTS_SERVICE_PORT'))
```

## Common Error Messages

### "Service products unavailable"
- **Cause:** Products service not running
- **Fix:** Start products service on port 8001

### "Could not connect to service"
- **Cause:** Service is down or wrong port
- **Fix:** Check service is running and port matches .env

### "Database connection failed"
- **Cause:** Database not running or wrong credentials
- **Fix:** Start Docker containers and check .env database settings

### "Module 'shared' not found"
- **Cause:** Python path not set correctly
- **Fix:** Make sure you're running from service directory and shared is in path

### "Internal server error" (500)
- **Cause:** Unhandled exception in code
- **Fix:** Check logs for full traceback, enable DEBUG mode

## Quick Health Check

Run this script to check all services:

```bash
#!/bin/bash
# health_check.sh

echo "Checking services..."

# Check API Gateway
curl -s http://localhost:8000/api/v1/products/queries/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ API Gateway (8000) - OK"
else
    echo "✗ API Gateway (8000) - FAILED"
fi

# Check Products
curl -s http://localhost:8001/api/v1/products/queries/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Products (8001) - OK"
else
    echo "✗ Products (8001) - FAILED"
fi

# Check Catalog
curl -s http://localhost:8002/api/v1/catalog/queries/categories/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Catalog (8002) - OK"
else
    echo "✗ Catalog (8002) - FAILED"
fi

# Check CMS
curl -s http://localhost:8003/api/v1/cms/queries/homepage/current/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ CMS (8003) - OK"
else
    echo "✗ CMS (8003) - FAILED"
fi

echo "Done!"
```

## Getting Help

If you're still experiencing issues:

1. **Check logs:** Look at console output from services
2. **Enable DEBUG:** Set `APP_DEBUG=true` in .env
3. **Test individually:** Test each service directly before going through API Gateway
4. **Check dependencies:** Make sure all Python packages are installed
5. **Verify configuration:** Double-check .env file matches your setup

