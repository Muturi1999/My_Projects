# Backend API Updates for Shopping Cart, Wishlist, Checkout, and Product Detail Features

## Overview
This document outlines all the backend API updates made to support the shopping cart, wishlist, checkout, and enhanced product detail page features implemented in the frontend.

## 1. Wishlist Model

### Location
- `backend/services/orders/commands/models.py`
- `backend/services/orders/queries/models.py`

### Changes
- Added `Wishlist` model to support user wishlist functionality
- Fields:
  - `session_id`: For guest users
  - `user_id`: For authenticated users (optional)
  - `product_id`: Reference to product
  - `is_active`: Soft delete flag
- Unique constraint on `(session_id, product_id)` to prevent duplicates
- Indexes for performance on `session_id` and `user_id`

## 2. Enhanced Product Model

### Location
- `backend/services/products/commands/models.py`

### New Fields Added
- `sku`: Stock Keeping Unit (CharField, indexed)
- `model`: Product model name (CharField)
- `long_description`: Extended product description (TextField)
- `description_blocks`: Structured description blocks (JSONField)
- `service_info`: Delivery, returns, warranty information (JSONField)
- `spec_groups`: Grouped technical specifications (JSONField)
- `addons`: Related add-ons/accessories (JSONField)
- `similar_product_ids`: IDs of similar products (JSONField)

These fields support the enhanced product detail page with:
- Rich product descriptions
- Service information (delivery, returns, warranty)
- Technical specifications grouped by category
- Related add-ons/accessories
- Similar product recommendations

## 3. Wishlist API Endpoints

### Query Endpoints (Read Operations)
**Base URL**: `/api/v1/orders/wishlists/`

- `GET /api/v1/orders/wishlists/` - List all wishlist items
- `GET /api/v1/orders/wishlists/{id}/` - Get specific wishlist item
- `GET /api/v1/orders/wishlists/by-session/{session_id}/` - Get wishlist items by session
- `GET /api/v1/orders/wishlists/product-ids/{session_id}/` - Get list of product IDs in wishlist

### Command Endpoints (Write Operations)
**Base URL**: `/api/v1/orders/wishlists/`

- `POST /api/v1/orders/wishlists/toggle/` - Add or remove product from wishlist
  ```json
  {
    "session_id": "string",
    "product_id": "uuid",
    "user_id": "uuid (optional)"
  }
  ```

- `POST /api/v1/orders/wishlists/remove/` - Remove product from wishlist
  ```json
  {
    "session_id": "string",
    "product_id": "uuid"
  }
  ```

- `POST /api/v1/orders/wishlists/clear/` - Clear all items from wishlist
  ```json
  {
    "session_id": "string"
  }
  ```

## 4. Enhanced Cart API Endpoints

### Existing Endpoints
- `GET /api/v1/orders/carts/` - List carts
- `GET /api/v1/orders/carts/{id}/` - Get specific cart
- `GET /api/v1/orders/carts/by-session/{session_id}/` - Get cart by session

### New Command Endpoints
**Base URL**: `/api/v1/orders/carts/`

- `POST /api/v1/orders/carts/add-item/` - Add item to cart or update quantity
  ```json
  {
    "session_id": "string",
    "product_id": "uuid",
    "quantity": 1,
    "user_id": "uuid (optional)"
  }
  ```

- `POST /api/v1/orders/carts/update-quantity/` - Update cart item quantity
  ```json
  {
    "session_id": "string",
    "product_id": "uuid",
    "quantity": 2
  }
  ```

- `POST /api/v1/orders/carts/remove-item/` - Remove item from cart
  ```json
  {
    "session_id": "string",
    "product_id": "uuid"
  }
  ```

- `POST /api/v1/orders/carts/clear/` - Clear all items from cart
  ```json
  {
    "session_id": "string"
  }
  ```

## 5. Enhanced Product Serializers

### Location
- `backend/services/products/queries/serializers.py`

### Updates
- **ProductListSerializer**: Added `sku` and `model` fields
- **ProductDetailSerializer**: Added all new fields:
  - `long_description`
  - `description_blocks`
  - `service_info`
  - `spec_groups`
  - `addons`
  - `similar_product_ids`

These serializers now return complete product information for the enhanced product detail page.

## 6. Enhanced Order/Checkout API

### Existing Endpoints
- `POST /api/v1/orders/orders/` - Create new order
- `GET /api/v1/orders/orders/{id}/` - Get order details
- `PATCH /api/v1/orders/orders/{id}/status/` - Update order status

### New Checkout Endpoints
**Base URL**: `/api/v1/orders/orders/`

- `POST /api/v1/orders/orders/from-cart/` - Create order from cart
  ```json
  {
    "session_id": "string",
    "user_id": "uuid (optional)",
    "items": [
      {
        "product_id": "uuid",
        "product_name": "string",
        "product_slug": "string",
        "product_image": "url",
        "quantity": 1,
        "unit_price": "decimal",
        "total_price": "decimal"
      }
    ],
    "customer_name": "string",
    "customer_email": "email",
    "customer_phone": "string",
    "shipping_address": "string",
    "shipping_city": "string",
    "shipping_postal_code": "string",
    "shipping_country": "string",
    "tax": "decimal",
    "shipping_cost": "decimal",
    "discount": "decimal",
    "payment_method": "string",
    "payment_status": "string"
  }
  ```

- `POST /api/v1/orders/orders/buy-now/` - Create order for single product (Buy Now flow)
  ```json
  {
    "session_id": "string",
    "user_id": "uuid (optional)",
    "product_id": "uuid",
    "quantity": 1,
    "unit_price": "decimal",
    "product_name": "string",
    "product_slug": "string",
    "product_image": "url",
    "customer_name": "string",
    "customer_email": "email",
    "customer_phone": "string",
    "shipping_address": "string",
    "shipping_city": "string",
    "shipping_postal_code": "string",
    "shipping_country": "string",
    "tax": "decimal",
    "shipping_cost": "decimal",
    "discount": "decimal",
    "payment_method": "string",
    "payment_status": "string"
  }
  ```

## 7. URL Configuration Updates

### Updated Files
- `backend/services/orders/queries/urls.py` - Added WishlistQueryViewSet
- `backend/services/orders/commands/urls.py` - Added WishlistCommandViewSet

### API Gateway
The existing API gateway (`backend/api_gateway/gateway/routes.py`) already proxies all requests to the orders service, so all new endpoints are automatically accessible through:
- `/api/v1/orders/wishlists/...`
- `/api/v1/orders/carts/...`
- `/api/v1/orders/orders/...`

## 8. Database Migrations Required

After these changes, you'll need to create and run migrations:

```bash
# For orders service
cd backend/services/orders
python manage.py makemigrations
python manage.py migrate

# For products service
cd backend/services/products
python manage.py makemigrations
python manage.py migrate
```

## 9. Integration Notes

### Frontend Integration
The frontend currently uses `localStorage` for cart and wishlist. To integrate with the backend:

1. **Cart Integration**:
   - Sync localStorage cart with backend on page load
   - Call backend API when adding/removing items
   - Use `session_id` from cookies or generate a unique session ID

2. **Wishlist Integration**:
   - Sync localStorage wishlist with backend on page load
   - Call backend API when toggling wishlist items
   - Use `session_id` for guest users, `user_id` for authenticated users

3. **Checkout Integration**:
   - Use `POST /api/v1/orders/orders/from-cart/` for cart checkout
   - Use `POST /api/v1/orders/orders/buy-now/` for Buy Now flow
   - Clear cart after successful order creation

### Session Management
- Generate a unique `session_id` for each guest user (store in cookies/localStorage)
- When user logs in, migrate cart/wishlist from `session_id` to `user_id`
- Support both guest and authenticated user flows

## 10. Testing Endpoints

### Test Wishlist
```bash
# Add to wishlist
curl -X POST http://localhost:8000/api/v1/orders/wishlists/toggle/ \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-session", "product_id": "product-uuid"}'

# Get wishlist
curl http://localhost:8000/api/v1/orders/wishlists/by-session/test-session/
```

### Test Cart
```bash
# Add to cart
curl -X POST http://localhost:8000/api/v1/orders/carts/add-item/ \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-session", "product_id": "product-uuid", "quantity": 1}'

# Get cart
curl http://localhost:8000/api/v1/orders/carts/by-session/test-session/
```

### Test Checkout
```bash
# Buy Now
curl -X POST http://localhost:8000/api/v1/orders/orders/buy-now/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-session",
    "product_id": "product-uuid",
    "quantity": 1,
    "unit_price": 100.00,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "shipping_address": "123 Main St",
    "shipping_city": "Nairobi",
    "total": 100.00
  }'
```

## Summary

All backend APIs have been updated to support:
- ✅ Wishlist functionality (add, remove, toggle, clear)
- ✅ Enhanced cart operations (add, update, remove, clear)
- ✅ Checkout flow (from cart and Buy Now)
- ✅ Enhanced product detail page with all new fields
- ✅ Proper serialization of all product fields
- ✅ Session-based and user-based cart/wishlist support

The backend is now ready to integrate with the frontend shopping cart, wishlist, checkout, and product detail features.

