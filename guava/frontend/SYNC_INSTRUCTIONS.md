# Frontend to CMS Sync Instructions

## Overview
The sync script copies all frontend hardcoded data into the CMS store, making it manageable through the admin dashboard.

## What Gets Synced

1. **Hero Slides** - Preserved (not overwritten if they exist)
2. **All 12 Categories** - From `shopCategories`
3. **Today's Hot Deals** - All products from `hotDeals` array
4. **Top Laptop Deals** - All products from `laptopDeals` array
5. **Printers & Scanners Deals** - ALL products from `printerDeals` array
6. **Computer Accessories Deals** - ALL products from `accessoriesDeals` array
7. **Audio & Headphones Deals** - ALL products from `audioDeals` array
8. **Shop Popular Brands** - All brands from `popularBrands` array
9. **Popular Categories** - All categories from `popularCategories` array

## How to Sync

1. Navigate to: **Admin Dashboard → CMS → Homepage**
2. Click the **"Sync Frontend to CMS"** button (green button in the header)
3. Wait for the sync to complete (you'll see a success message with statistics)
4. The page will automatically reload after 2 seconds to show the updated data

## After Syncing

- All sections will be populated with products from the frontend data
- You can view all products in: **Admin Dashboard → CMS → Inventory**
- Products are organized by:
  - **Categories** (expandable sections)
  - **Brands** (expandable sections)
  - **All Products** (grid view)

## Troubleshooting

If sections are not showing all products:
1. Check the browser console for any errors
2. Verify the sync completed successfully (check the success message)
3. Refresh the page manually if it didn't auto-reload
4. Check the stats in the success message to see how many items were synced

## Notes

- The sync overwrites existing CMS data with frontend data
- Hero slides are preserved (not overwritten if they already exist)
- All product images are automatically mapped using the image mapper utility
- The sync happens in-memory and persists until the server restarts

