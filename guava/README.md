# Guava E-Commerce Platform

Full-stack e-commerce platform built with Next.js and Django REST Framework.

## Project Structure

```
guava/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   ├── lib/          # Utilities and API client
│   └── ...
├── backend/          # Django microservices backend
│   ├── services/     # Microservices (Products, Catalog, CMS, etc.)
│   ├── shared/       # Shared utilities
│   ├── api_gateway/  # API Gateway service
│   └── ...
└── .env.example      # Environment variables template
```

## Quick Start

### Backend Setup

See [backend/README.md](./backend/README.md) for detailed backend setup instructions.

```bash
# Start infrastructure
cd backend
docker-compose up -d

# Install dependencies and run migrations
# (See backend/README.md for details)
```

### Frontend Setup

See [frontend/README.md](./frontend/README.md) for detailed frontend setup instructions.

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## Architecture

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **API Client**: Axios with type-safe interfaces

### Backend
- **Framework**: Django REST Framework
- **Architecture**: Microservices with CQRS pattern
- **Database**: PostgreSQL (one per service)
- **Message Queue**: RabbitMQ
- **Caching**: Redis
- **API Gateway**: Django-based routing service

## Services

1. **Products Service** - Product catalog management
2. **Catalog Service** - Categories and brands
3. **CMS Service** - Homepage, navigation, footer content
4. **Orders Service** - Order processing and cart management
5. **Inventory Service** - Stock management
6. **Promotions Service** - Discounts, coupons, banners
7. **API Gateway** - Single entry point for all services

## Development

### Running the Full Stack

1. **Start Backend Services:**
   ```bash
   cd backend
   docker-compose up -d
   # Start each service (see backend/README.md)
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8000
   - RabbitMQ Management: http://localhost:15672

## Environment Variables

Copy `.env.example` to `.env` and configure:

- Database credentials for each service
- RabbitMQ connection
- Redis connection
- Service ports
- API URLs

## Documentation

- [Backend Documentation](./backend/README.md)
- [Backend Setup Guide](./backend/SETUP.md)
- [Frontend Documentation](./frontend/README.md)

## License

Private project - All rights reserved
