# Category Management System

## Overview

The category management system allows you to manage all categories from the CMS dashboard. Changes made in the dashboard are immediately reflected on the frontend.

## Features

✅ **View All Categories**: See all 12+ categories organized by rows (6 per row)
✅ **Create Categories**: Add new categories with name, slug, icon, image, description, and order
✅ **Edit Categories**: Update any category's details
✅ **Delete Categories**: Remove categories (soft delete)
✅ **Real-time Updates**: Changes in CMS dashboard automatically reflect on the frontend

## How to Use

### Accessing Category Management

1. Navigate to **Admin Dashboard** → **CMS** → **Categories** tab
2. You'll see all categories organized in rows:
   - **First Row**: First 6 categories
   - **Second Row**: Next 6 categories (if available)
   - **Additional Categories**: Any remaining categories beyond 12

### Creating a Category

1. Click the **"Add Category"** button
2. Fill in the form:
   - **Name** (required): Display name (e.g., "Laptops & Computers")
   - **Slug** (required): URL-friendly identifier (e.g., "laptops-computers")
   - **Icon**: Icon identifier (e.g., "laptop", "keyboard", "monitor")
   - **Image URL**: Optional image URL
   - **Description**: Optional description
   - **Order**: Display order (0-based)
3. Click **"Save"**

### Editing a Category

1. Find the category in the list
2. Click the **pencil icon** (✏️) next to the category
3. Modify the fields as needed
4. Click **"Save"**

### Deleting a Category

1. Find the category in the list
2. Click the **trash icon** (🗑️) next to the category
3. Confirm the deletion

## Technical Implementation

### Components

- **`CategoriesTab.tsx`**: Main CMS dashboard component for managing categories
- **`CategoryGrid.tsx`**: Frontend component that displays categories (updated to fetch from API)
- **`useCategories.ts`**: React hook that fetches categories from API with fallback to static data

### API Integration

- **GET** `/api/admin/catalog/categories`: Fetch all categories
- **POST** `/api/admin/catalog/categories`: Create new category
- **PUT** `/api/admin/catalog/categories`: Update existing category
- **DELETE** `/api/admin/catalog/categories?id={id}`: Delete category

### Real-time Updates

When categories are created, updated, or deleted:
1. The CMS dashboard refreshes the category list
2. A custom event `categories:updated` is dispatched
3. The frontend `CategoryGrid` component listens for this event and automatically refreshes
4. Users see the updated categories immediately

### Data Flow

```
CMS Dashboard (CategoriesTab)
    ↓
API Route (/api/admin/catalog/categories)
    ↓
Catalog Service API (/catalog/commands/categories/)
    ↓
Database
    ↓
Frontend (CategoryGrid via useCategories hook)
```

## Frontend Display

Categories are displayed on the homepage in the "Shop by Category" section:
- **Layout**: 6 categories per row (responsive grid)
- **First Row**: Categories 1-6
- **Second Row**: Categories 7-12
- **Styling**: Cards with images/icons, hover effects, and links to category pages

## Fallback Behavior

If the API is unavailable:
- The system falls back to static data from `frontend/lib/data/categories.ts`
- This ensures the frontend always displays categories even if the backend is down
- Once the API is available, it automatically switches to API data

## Notes

- Categories are soft-deleted (marked as inactive) rather than permanently removed
- Slug must be unique
- Categories are ordered by the `order` field
- The frontend automatically refreshes when categories are modified in the CMS

