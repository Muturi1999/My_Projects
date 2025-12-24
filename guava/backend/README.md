# Guava Stores - Django REST Framework Backend

A production-ready Django Rest Framework backend for the Guava Stores electronics ecommerce platform.

## Features

- **Products & Variants**: Support for products with variants (RAM, Storage, Color) and stock tracking
- **Inventory Management**: Serial number/IMEI tracking for electronics
- **Order Management**: Complete order lifecycle with guest checkout support
- **Warranty Management**: Automatic warranty tracking and expiry calculation
- **Reviews & Ratings**: Product reviews with auto-calculated ratings
- **Promotions**: Discount codes and flash sales
- **JWT Authentication**: Secure token-based authentication
- **Django Admin**: Fully configured admin interface
- **CMS**: Homepage sections and hero slides management
- **Dashboard**: Admin statistics and analytics

## Tech Stack

- Django 5.0.1
- Django REST Framework 3.14.0
- JWT Authentication (djangorestframework-simplejwt)
- SQLite (development) - easily switchable to PostgreSQL
- Django CORS Headers for frontend integration

## Quick Start

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 4. Database Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## Project Structure

```
backend/
├── config/              # Django project settings
├── accounts/            # User authentication & profiles
├── products/            # Products, categories, brands, variants
├── inventory/           # Serial/IMEI tracking
├── orders/              # Cart, orders, shipping, warranty
├── reviews/             # Product reviews & ratings
├── promotions/          # Discounts & flash sales
├── cms/                 # Homepage sections & hero slides
├── dashboard/           # Admin dashboard APIs
└── manage.py
```

## API Endpoints

### Authentication

**Public:**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (email/phone + password)
- `POST /api/auth/token/refresh/` - Refresh JWT token

**Authenticated:**
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

**Admin/Staff Only:**
- `GET /api/auth/users/` - List all users
- `GET /api/auth/users/{id}/` - Get user detail
- `POST /api/auth/users/` - Create user
- `PUT /api/auth/users/{id}/` - Update user
- `DELETE /api/auth/users/{id}/` - Delete user
- `POST /api/auth/users/{id}/activate/` - Activate user
- `POST /api/auth/users/{id}/deactivate/` - Deactivate user
- `POST /api/auth/users/{id}/make_staff/` - Make user staff
- `GET /api/auth/users/staff/` - Get all staff
- `GET /api/auth/users/customers/` - Get all customers

### Products

**Public (Read-Only):**
- `GET /api/products/queries/` - List products (paginated, filtered)
- `GET /api/products/queries/{slug}/` - Get product detail
- `GET /api/products/queries/hot_deals/` - Get hot deals
- `GET /api/products/queries/by-category/{slug}/` - Products by category
- `GET /api/products/queries/by-brand/{slug}/` - Products by brand
- `GET /api/products/queries/search/?q=query` - Search products
- `GET /api/products/categories/` - List categories (with subcategories)
- `GET /api/products/brands/` - List brands

**Filters:**
- `?category_slug=slug` - Filter by category
- `?brand_slug=slug` - Filter by brand
- `?min_price=1000&max_price=50000` - Price range
- `?min_rating=4` - Minimum rating
- `?in_stock=true` - Only in stock
- `?hot=true` - Hot deals only
- `?featured=true` - Featured only

**Admin/Staff (Full CRUD):**
- `POST /api/products/queries/` - Create product
- `PUT /api/products/queries/{slug}/` - Update product
- `PATCH /api/products/queries/{slug}/` - Partial update
- `DELETE /api/products/queries/{slug}/` - Delete product

**Product Creation Payload:**
```json
{
  "name": "HP Pavilion 15",
  "sku": "HP-PAV-15-001",
  "description": "Powerful laptop",
  "price": 89999,
  "original_price": 99999,
  "category_slug": "laptops-computers",
  "subcategory_slug": null,
  "brand_slug": "hp",
  "tags": ["laptop", "hp"],
  "condition": "new",
  "stock_quantity": 10,
  "sections": {
    "hot": true,
    "featured": false
  },
  "images": [
    {
      "image_url": "https://example.com/image.jpg",
      "alt_text": "HP Pavilion 15",
      "order": 0
    }
  ],
  "feature_list": ["Backlit Keyboard", "HDMI Port"]
}
```

### Categories (Full CRUD)

**Public (Read-Only):**
- `GET /api/products/categories/` - List categories
- `GET /api/products/categories/{slug}/` - Get category detail

**Admin/Staff (Write):**
- `POST /api/products/categories/` - Create category
- `PUT /api/products/categories/{slug}/` - Update category
- `DELETE /api/products/categories/{slug}/` - Delete category

### Brands (Full CRUD)

**Public (Read-Only):**
- `GET /api/products/brands/` - List brands
- `GET /api/products/brands/{slug}/` - Get brand detail

**Admin/Staff (Write):**
- `POST /api/products/brands/` - Create brand
- `PUT /api/products/brands/{slug}/` - Update brand
- `DELETE /api/products/brands/{slug}/` - Delete brand

### Sections (Homepage Sections - Admin/Staff Only)

- `GET /api/cms/sections/` - List all sections
- `GET /api/cms/sections/{id}/` - Get section detail
- `POST /api/cms/sections/` - Create section
- `PUT /api/cms/sections/{id}/` - Update section
- `DELETE /api/cms/sections/{id}/` - Delete section

**Section Types:** hot_deals, laptop_deals, printer_scanner, accessories, audio, popular_brands, popular_categories, featured

### Hero Slides (Admin/Staff Only)

- `GET /api/cms/hero-slides/` - List hero slides
- `POST /api/cms/hero-slides/` - Create hero slide
- `PUT /api/cms/hero-slides/{id}/` - Update hero slide
- `DELETE /api/cms/hero-slides/{id}/` - Delete hero slide

### Campaigns/Promotions (Admin/Staff Only)

**Discounts:**
- `GET /api/promotions/discounts/` - List discounts
- `POST /api/promotions/discounts/` - Create discount
- `PUT /api/promotions/discounts/{id}/` - Update discount
- `DELETE /api/promotions/discounts/{id}/` - Delete discount
- `GET /api/promotions/discounts/active/` - Get active discounts
- `POST /api/promotions/discounts/{id}/validate_code/` - Validate discount code

**Flash Sales:**
- `GET /api/promotions/flash-sales/` - List flash sales
- `POST /api/promotions/flash-sales/` - Create flash sale
- `PUT /api/promotions/flash-sales/{id}/` - Update flash sale
- `DELETE /api/promotions/flash-sales/{id}/` - Delete flash sale
- `GET /api/promotions/flash-sales/active/` - Get active flash sales

### Dashboard (Admin/Staff Only)

- `GET /api/dashboard/stats/` - Dashboard statistics
  - Orders: total, today, this month, last month, status breakdown
  - Revenue: total, this month, last month, growth
  - Products: total, low stock, out of stock
  - Users: total, new today, new this month
  - Reviews: total, pending approval
  - Catalog: categories count, brands count

- `GET /api/dashboard/recent-orders/?limit=10` - Recent orders
- `GET /api/dashboard/top-products/?limit=10` - Top selling products

### Cart (Authenticated Users)

- `GET /api/orders/cart/` - Get user cart
- `POST /api/orders/cart/{id}/add_item/` - Add item to cart
- `POST /api/orders/cart/{id}/update_quantity/` - Update item quantity
- `DELETE /api/orders/cart/{id}/remove_item/` - Remove item from cart

### Orders

- `POST /api/orders/` - Create order (from cart or direct, supports guest checkout)
- `GET /api/orders/` - List user orders (authenticated)
- `GET /api/orders/{id}/` - Get order detail
- `GET /api/orders/{id}/warranty/` - Get warranty information

**Order Creation Payload:**
```json
{
  "shipping_name": "John Doe",
  "shipping_phone": "+254712345678",
  "shipping_email": "john@example.com",
  "shipping_address": "123 Main St",
  "shipping_city": "Nairobi",
  "shipping_country": "Kenya",
  "payment_method": "mpesa",
  "discount_code": "SAVE10",
  "guest_email": "guest@example.com",  // For guest checkout
  "items": [  // For direct/buy-now orders
    {
      "variant_id": 1,
      "quantity": 1
    }
  ]
}
```

### Reviews

**Public (Read-Only):**
- `GET /api/reviews/` - List reviews
- `GET /api/reviews/by-product/{id}/` - Reviews for a product

**Authenticated Users:**
- `POST /api/reviews/` - Create review (one per user per product)

## Frontend Integration

### Base URL Configuration

Update your frontend `.env.local` file:

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000/api
```

### JWT Token Usage

After login, store the access token and include it in requests:

```typescript
// In your API client
const token = localStorage.getItem('access_token');
config.headers.Authorization = `Bearer ${token}`;
```

### Product Creation Flow

1. Admin creates product in dashboard with all fields (tags, features, images, etc.)
2. Frontend sends to `/api/admin/products` (Next.js API route)
3. Next.js routes to Django: `POST /api/products/queries/`
4. Product saved to database with category assignment
5. Product automatically appears in category pages
6. All information displayed on product detail page

## Django Admin

Access the admin panel at `http://localhost:8000/admin/`

### Admin Features

- **Products Management**: Create/edit products, variants, categories, brands
- **Inventory Tracking**: Assign serial numbers/IMEIs to order items
- **Order Management**: View and update order status
- **Warranty Management**: Track warranty periods and expiry
- **Discount Management**: Create and manage discount codes
- **Review Moderation**: Approve/reject product reviews
- **CMS Management**: Manage homepage sections and hero slides

## Database Models

### Key Models

- **User**: Custom user model with email/phone login
- **Product**: Base product with pricing, tags, SKU, condition, flags
- **ProductVariant**: Variants with RAM, Storage, Color, stock tracking
- **Category**: Hierarchical categories with subcategories
- **Brand**: Product brands
- **Order**: Order with lifecycle management (Pending → Paid → Shipped → Delivered → Cancelled)
- **Cart**: Shopping cart for authenticated users
- **ProductReview**: Reviews with ratings (auto-calculates product rating)
- **Discount**: Percentage or fixed discounts with validity and usage limits
- **FlashSale**: Time-limited sales with stock limits
- **Warranty**: Warranty tracking per order item with auto-expiry calculation
- **SerialNumber**: Serial/IMEI tracking for inventory
- **HomepageSection**: Homepage sections (hot deals, printer deals, etc.)
- **HeroSlide**: Hero banner slides

## Permission Levels

1. **Public (AllowAny)**: Read-only access to products, categories, brands, reviews
2. **Authenticated Users**: Can create orders, reviews, manage cart
3. **Staff (`is_staff = True`)**: Full CRUD on products, sections, campaigns, dashboard access
4. **Admin (`is_superuser = True`)**: All permissions + user management

## Security Features

- JWT token-based authentication
- Password validation
- Role-based permissions (Admin vs Staff vs Customer)
- Input validation on all endpoints
- Atomic transactions for stock management (prevents overselling)
- CORS configuration for frontend
- Custom exception handlers for consistent error responses

## Testing

```bash
python manage.py test
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL database (replace SQLite)
4. Configure static files serving
5. Set up email backend
6. Configure CORS for production domain
7. Use environment variables for all sensitive data
8. Set up proper logging
9. Configure HTTPS
10. Set up backup strategy

## Example API Requests

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "securepass123",
    "password2": "securepass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email_or_phone": "user@example.com",
    "password": "securepass123"
  }'
```

### Create Product (Admin/Staff)
```bash
curl -X POST http://localhost:8000/api/products/queries/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {access_token}" \
  -d '{
    "name": "Test Product",
    "price": 10000,
    "original_price": 12000,
    "category_slug": "laptops-computers",
    "tags": ["test", "laptop"],
    "stock_quantity": 5
  }'
```

### Get Products by Category
```bash
curl http://localhost:8000/api/products/queries/?category_slug=laptops-computers
```

## License

Proprietary - Guava Stores
