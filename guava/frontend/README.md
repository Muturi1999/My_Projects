# Guava E-Commerce Frontend

Next.js 16 frontend application for the Guava e-commerce platform.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Heroicons** - Icon library
- **Axios** - HTTP client for API calls
- **Zod** - Schema validation

## Project Structure

```
frontend/
├── app/              # Next.js App Router pages
│   ├── (admin)/      # Admin dashboard routes
│   ├── api/          # API routes (Next.js API)
│   ├── category/     # Category pages
│   ├── product/      # Product detail pages
│   └── ...
├── components/        # React components
│   ├── admin/        # Admin components
│   ├── ui/           # Reusable UI components
│   └── ...           # Feature components
├── lib/              # Utilities and helpers
│   ├── api/          # API client (Axios)
│   ├── config/       # Configuration
│   ├── data/         # Mock data (temporary)
│   └── types/        # TypeScript types
├── public/           # Static assets
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Backend services running (see `../backend/README.md`)

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000
NEXT_PUBLIC_DOMAIN=localhost
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Integration

The frontend uses the API client located in `lib/api/` to communicate with the backend services through the API Gateway.

### Example Usage

```typescript
import { productsApi } from '@/lib/api';

// Get products
const products = await productsApi.list({ category: 'laptops' });

// Get single product
const product = await productsApi.get(productId);

// Get hot deals
const hotDeals = await productsApi.getHotDeals();
```

## Components

### Reusable Components

- `ProductCard` - Unified product card component
- `AddToCartButton` - Add to cart button with icon
- `SectionHeader` - Section title with "View all" link
- `BrandCard` - Brand logo card
- `PromotionalBanner` - Promotional banner component

### Feature Components

- `HeroBanner` - Homepage hero section
- `HotDealsSection` - Hot deals section
- `TopLaptopDealsSection` - Top laptop deals
- `BrandSection` - Brand showcase
- `CategoryGrid` - Category grid
- And more...

## Styling

The project uses Tailwind CSS with custom configuration. All components follow a consistent design system with:

- Sharp square edges (`rounded-none`)
- Consistent spacing and padding
- Responsive design (mobile-first)
- Dark red accent color (`#DC2626`)

## Next Steps

- [ ] Replace mock data with API calls
- [ ] Implement authentication
- [ ] Add shopping cart functionality
- [ ] Implement checkout flow
- [ ] Add search functionality
- [ ] Implement filters and sorting
- [ ] Add user account pages
- [ ] Add order tracking

