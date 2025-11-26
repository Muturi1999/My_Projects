# Backend Setup Guide

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Start infrastructure (Docker):**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Install Python dependencies:**
   ```bash
   # Install shared utilities
   cd backend/shared
   pip install -r requirements.txt
   
   # Install service dependencies (repeat for each service)
   cd ../services/products
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   cd backend/services/products
   python manage.py migrate
   # Repeat for catalog, cms, orders, inventory, promotions
   ```

5. **Start services:**
   ```bash
   # Terminal 1 - Products
   cd backend/services/products
   python manage.py runserver 8001
   
   # Terminal 2 - Catalog
   cd backend/services/catalog
   python manage.py runserver 8002
   
   # Terminal 3 - CMS
   cd backend/services/cms
   python manage.py runserver 8003
   
   # Terminal 4 - Orders
   cd backend/services/orders
   python manage.py runserver 8004
   
   # Terminal 5 - Inventory
   cd backend/services/inventory
   python manage.py runserver 8005
   
   # Terminal 6 - Promotions
   cd backend/services/promotions
   python manage.py runserver 8006
   
   # Terminal 7 - API Gateway
   cd backend/api_gateway
   python manage.py runserver 8000
   ```

6. **Start frontend:**
   ```bash
   npm install  # Install axios and zod if not already installed
   npm run dev
   ```

## Environment Variables

All environment variables are centralized in `.env.example`. Copy to `.env` and configure:

- Database credentials for each service
- RabbitMQ connection
- Redis connection
- Service ports
- API URLs

## Testing the Setup

1. **Check API Gateway:**
   ```bash
   curl http://localhost:8000/api/v1/products/queries/
   ```

2. **Check Products Service:**
   ```bash
   curl http://localhost:8001/api/v1/products/queries/
   ```

3. **Check RabbitMQ Management UI:**
   - Open http://localhost:15672
   - Login: guest/guest

## Next Steps

- Create superuser for each service: `python manage.py createsuperuser`
- Load initial data (fixtures)
- Set up event listeners for message queue
- Configure frontend to use API Gateway


