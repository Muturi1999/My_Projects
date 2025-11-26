# Guava E-Commerce Backend

Django REST Framework microservices backend with CQRS pattern, message queues, and PostgreSQL.

## Architecture

- **Microservices**: Products, Catalog, CMS, Orders, Inventory, Promotions, Reports
- **CQRS Pattern**: Separate command (write) and query (read) sides for each service
- **Message Queue**: RabbitMQ for event-driven communication
- **Caching**: Redis for performance optimization
- **API Gateway**: Single entry point for all services

## Project Structure

```
backend/
├── services/          # Microservices
│   ├── products/
│   ├── catalog/
│   ├── cms/
│   ├── orders/
│   ├── inventory/
│   ├── promotions/
│   └── reports/
├── shared/            # Shared utilities
│   ├── common/        # Base models, serializers, viewsets
│   ├── messaging/     # RabbitMQ publishers/consumers
│   ├── exceptions/    # Custom exceptions
│   └── config/        # Environment configuration
├── api_gateway/       # API Gateway service
└── docker-compose.yml # Docker setup
```

## Setup

### Prerequisites

- Python 3.10+
- PostgreSQL 15+
- RabbitMQ
- Redis
- Docker & Docker Compose (optional)

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Docker Setup (Recommended)

```bash
cd backend
docker-compose up -d
```

This will start:
- 7 PostgreSQL databases (one per service)
- RabbitMQ
- Redis

### Manual Setup

1. Install dependencies for shared utilities:
```bash
cd backend/shared
pip install -r requirements.txt
```

2. Install dependencies for each service:
```bash
cd backend/services/products
pip install -r requirements.txt
```

3. Run migrations for each service:
```bash
cd backend/services/products
python manage.py migrate
```

4. Start each service:
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
```

5. Start API Gateway:
```bash
cd backend/api_gateway
python manage.py runserver 8000
```

## API Endpoints

All requests go through the API Gateway at `http://localhost:8000/api/v1/`

### Products
- `GET /api/v1/products/queries/` - List products
- `GET /api/v1/products/queries/{id}/` - Get product
- `GET /api/v1/products/queries/hot-deals/` - Hot deals
- `GET /api/v1/products/queries/by-category/{slug}/` - By category
- `GET /api/v1/products/queries/by-brand/{slug}/` - By brand
- `POST /api/v1/products/commands/` - Create product (admin)

### Catalog
- `GET /api/v1/catalog/queries/categories/` - List categories
- `GET /api/v1/catalog/queries/categories/{slug}/` - Get category
- `GET /api/v1/catalog/queries/brands/` - List brands
- `GET /api/v1/catalog/queries/brands/{slug}/` - Get brand

### CMS
- `GET /api/v1/cms/queries/homepage/current/` - Get homepage
- `GET /api/v1/cms/queries/navigation/current/` - Get navigation
- `GET /api/v1/cms/queries/footer/current/` - Get footer
- `GET /api/v1/cms/queries/service-guarantees/` - Get service guarantees

### Orders
- `GET /api/v1/orders/queries/orders/` - List orders
- `POST /api/v1/orders/commands/orders/` - Create order
- `GET /api/v1/orders/queries/carts/by-session/{session_id}/` - Get cart

### Inventory
- `GET /api/v1/inventory/queries/stocks/` - List stocks
- `GET /api/v1/inventory/queries/stocks/by-product/{product_id}/` - Get stock for product
- `GET /api/v1/inventory/queries/stocks/low-stock/` - Low stock alerts

### Promotions
- `GET /api/v1/promotions/queries/discounts/active/` - Active discounts
- `GET /api/v1/promotions/queries/coupons/by-code/{code}/` - Get coupon
- `GET /api/v1/promotions/queries/banners/by-position/{position}/` - Get banners

## Message Queue Events

### Product Events
- `product.created` - Published when product is created
- `product.updated` - Published when product is updated
- `product.deleted` - Published when product is deleted

### Order Events
- `order.created` - Published when order is created
- `order.status_changed` - Published when order status changes

### Inventory Events
- `stock.updated` - Published when stock is updated
- `stock.low` - Published when stock is low

## Development

### Running Tests

Each service has its own test suite:

```bash
cd backend/services/products
python manage.py test
```

### Adding New Environment Variables

1. Add to `.env.example`
2. Add to `backend/shared/config/env.py` (Python)
3. Add to `lib/config/env.ts` (TypeScript)
4. Update this README

## Next Steps

- [ ] Add authentication/authorization
- [ ] Implement Reports service
- [ ] Add comprehensive tests
- [ ] Set up CI/CD
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement caching strategies
- [ ] Add monitoring and logging


