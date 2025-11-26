# API Documentation

Complete API documentation for all microservices.

## Base URL

All API requests go through the API Gateway:
```
http://localhost:8000/api/v1/
```

## Authentication

Currently, authentication is not implemented. All endpoints are publicly accessible.

## Products Service

### List Products
```http
GET /api/v1/products/queries/
```

**Query Parameters:**
- `category` (string) - Filter by category slug
- `brand` (string) - Filter by brand slug
- `hot` (boolean) - Filter hot deals
- `featured` (boolean) - Filter featured products
- `min_price` (number) - Minimum price
- `max_price` (number) - Maximum price
- `min_rating` (number) - Minimum rating
- `in_stock` (boolean) - Only in stock items
- `search` (string) - Search in name/description
- `page` (number) - Page number
- `page_size` (number) - Items per page
- `ordering` (string) - Sort field (price, rating, created_at, name)

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/v1/products/queries/?page=2",
  "previous": null,
  "page_size": 20,
  "total_pages": 5,
  "current_page": 1,
  "results": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "price": 999.99,
      "original_price": 1299.99,
      "discount_percentage": 23,
      "image": "https://...",
      "category_slug": "laptops",
      "brand_slug": "hp",
      "hot": true,
      "rating": 4,
      "rating_count": 25,
      "stock_quantity": 10
    }
  ]
}
```

### Get Product
```http
GET /api/v1/products/queries/{id}/
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Product Name",
  "slug": "product-name",
  "description": "Full description",
  "price": 999.99,
  "original_price": 1299.99,
  "discount_percentage": 23,
  "image": "https://...",
  "images": ["https://..."],
  "category_slug": "laptops",
  "brand_slug": "hp",
  "hot": true,
  "featured": false,
  "rating": 4,
  "rating_count": 25,
  "stock_quantity": 10,
  "specifications": {
    "processor": "Intel Core i7",
    "ram": "16GB",
    "storage": "512GB SSD"
  },
  "product_images": [...]
}
```

### Hot Deals
```http
GET /api/v1/products/queries/hot-deals/
```

### Products by Category
```http
GET /api/v1/products/queries/by-category/{category_slug}/
```

### Products by Brand
```http
GET /api/v1/products/queries/by-brand/{brand_slug}/
```

### Search Products
```http
GET /api/v1/products/queries/search/?q=search+term
```

## Catalog Service

### List Categories
```http
GET /api/v1/catalog/queries/categories/
```

### Get Category
```http
GET /api/v1/catalog/queries/categories/{id_or_slug}/
```

### Get Subcategories
```http
GET /api/v1/catalog/queries/categories/{id}/subcategories/
```

### List Brands
```http
GET /api/v1/catalog/queries/brands/
```

### Get Brand
```http
GET /api/v1/catalog/queries/brands/{id_or_slug}/
```

## CMS Service

### Get Homepage
```http
GET /api/v1/cms/queries/homepage/current/
```

### Get Navigation
```http
GET /api/v1/cms/queries/navigation/current/
```

### Get Footer
```http
GET /api/v1/cms/queries/footer/current/
```

### Get Service Guarantees
```http
GET /api/v1/cms/queries/service-guarantees/
```

## Orders Service

### Create Order
```http
POST /api/v1/orders/commands/orders/
```

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "shipping_address": "123 Main St",
  "shipping_city": "Nairobi",
  "shipping_postal_code": "00100",
  "shipping_country": "Kenya",
  "subtotal": 999.99,
  "tax": 0,
  "shipping_cost": 0,
  "discount": 0,
  "total": 999.99,
  "payment_method": "mpesa",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "Product Name",
      "product_slug": "product-name",
      "product_image": "https://...",
      "quantity": 1,
      "unit_price": 999.99,
      "total_price": 999.99
    }
  ]
}
```

### List Orders
```http
GET /api/v1/orders/queries/orders/
```

### Get Order
```http
GET /api/v1/orders/queries/orders/{id}/
```

### Get Cart
```http
GET /api/v1/orders/queries/carts/by-session/{session_id}/
```

## Inventory Service

### List Stocks
```http
GET /api/v1/inventory/queries/stocks/
```

### Get Stock by Product
```http
GET /api/v1/inventory/queries/stocks/by-product/{product_id}/
```

### Low Stock Alerts
```http
GET /api/v1/inventory/queries/stocks/low-stock/
```

## Promotions Service

### Active Discounts
```http
GET /api/v1/promotions/queries/discounts/active/
```

### Get Coupon
```http
GET /api/v1/promotions/queries/coupons/by-code/{code}/
```

### Get Banners
```http
GET /api/v1/promotions/queries/banners/by-position/{position}/
```

## Reports Service

### Sales Summary
```http
GET /api/v1/reports/queries/sales/summary/
```

### Top Selling Products
```http
GET /api/v1/reports/queries/products/top-selling/?limit=10
```

### Latest Inventory Report
```http
GET /api/v1/reports/queries/inventory/latest/
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "message": "Detailed error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

Currently, no rate limiting is implemented.

## CORS

CORS is enabled for:
- `http://localhost:3000` (Frontend)

## Next Steps

- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement authentication
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Add response caching headers

