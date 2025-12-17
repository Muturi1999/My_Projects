# Hot Deals CMS Integration Setup Guide

This guide will help you set up the Hot Deals section to be fully integrated with the CMS database.

## Prerequisites

1. PostgreSQL is running on port 5432
2. You have a PostgreSQL superuser account (usually `postgres`)
3. The CMS service database configuration is in `.env`

## Step 1: Create the CMS Database

The CMS database (`cms_db`) needs to be created manually. Run one of these commands:

**Option A: Using postgres user**
```bash
psql -U postgres -c "CREATE DATABASE cms_db;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE cms_db TO mike_admin;"
```

**Option B: Using the helper script (if you have sudo access)**
```bash
cd /home/mike/Desktop/My_Projects/guava
bash backend/scripts/create_cms_db.sh
```

**Option C: Manual creation via psql**
```bash
psql -U postgres
CREATE DATABASE cms_db;
GRANT ALL PRIVILEGES ON DATABASE cms_db TO mike_admin;
\q
```

## Step 2: Verify Database Configuration

Ensure your `.env` file has these CMS database settings:
```env
CMS_DB_NAME=cms_db
CMS_DB_USER=mike_admin
CMS_DB_PASSWORD=M!k3@muturi
CMS_DB_HOST=localhost
CMS_DB_PORT=5432
```

## Step 3: Run Migrations

From the project root:
```bash
cd backend/services/cms
export PYTHONPATH=/home/mike/Desktop/My_Projects/guava/backend:$PYTHONPATH
../../venv/bin/python manage.py makemigrations
../../venv/bin/python manage.py migrate
```

This will:
- Create the `cms_homepage` table with the new `hot_deals` JSON field
- Create other CMS tables (navigation, footer, service_guarantees)

## Step 4: Seed the CMS Data

Seed the database with the hot deals data:
```bash
cd backend/services/cms
export PYTHONPATH=/home/mike/Desktop/My_Projects/guava/backend:$PYTHONPATH
../../venv/bin/python manage.py seed_cms --file /home/mike/Desktop/My_Projects/guava/backend/data/mock-data-export.json --clear
```

This will:
- Clear any existing CMS data
- Load homepage configuration including the 4 hot deals items
- Load navigation, footer, and service guarantees

## Step 5: Verify the Setup

1. **Check the database:**
   ```bash
   psql -U mike_admin -d cms_db -c "SELECT id, title, hot_deals FROM cms_homepage;"
   ```

2. **Start the CMS service** (if not already running):
   ```bash
   cd backend/services/cms
   export PYTHONPATH=/home/mike/Desktop/My_Projects/guava/backend:$PYTHONPATH
   ../../venv/bin/python manage.py runserver 8003
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:8000/api/v1/cms/queries/homepage/
   ```

4. **Check the admin CMS:**
   - Navigate to `http://localhost:3000/admin/cms?tab=homepage`
   - You should see the "Today's Hot Deals" section with 4 items
   - You can edit items and upload images

## How It Works

### Backend Flow:
1. **CMS Service** (`backend/services/cms`):
   - Stores homepage data in PostgreSQL (`cms_homepage` table)
   - `hot_deals` is stored as a JSON field
   - Exposes REST API at `/api/v1/cms/queries/homepage/` (GET) and `/api/v1/cms/commands/homepage/` (POST/PATCH)

2. **API Gateway** (`backend/api_gateway`):
   - Routes `/cms/*` requests to the CMS service (port 8003)

### Frontend Flow:
1. **Admin CMS** (`/admin/cms?tab=homepage`):
   - Uses `adminApiClient.getHomepage()` to fetch from CMS API
   - Uses `adminApiClient.updateHomepage()` to save changes
   - Falls back to mock data if API is unavailable

2. **Storefront** (Homepage and `/hot-deals` page):
   - Currently uses mock data
   - **Next step**: Wire to use `cmsApi.getHomepage()` to fetch `hot_deals` from CMS

## Current Status

✅ **Completed:**
- CMS model updated with `hot_deals` field
- Migrations ready
- Seeding command updated
- Admin API client wired to CMS service
- Admin CMS UI already supports hot deals editing

⏳ **Pending:**
- Database creation (Step 1)
- Running migrations (Step 3)
- Seeding data (Step 4)
- Wiring frontend storefront to use CMS API (optional next step)

## Troubleshooting

**Error: "database cms_db does not exist"**
- Run Step 1 to create the database

**Error: "connection to server at localhost port 5434 failed"**
- Check `.env` file - `CMS_DB_PORT` should be `5432`, not `5434`

**Error: "Unknown command: 'seed_cms'"**
- Make sure you're running from `backend/services/cms` directory
- Make sure `PYTHONPATH` includes the backend directory
- Check that `commands` app is in `INSTALLED_APPS` in `cms/settings.py`

**Error: "ModuleNotFoundError: No module named 'shared'"**
- Set `PYTHONPATH=/home/mike/Desktop/My_Projects/guava/backend:$PYTHONPATH` before running commands

## Next Steps (Optional)

Once the database is set up and seeded:

1. **Wire frontend storefront to CMS API:**
   - Update `HotDealsSection` component to use `cmsApi.getHomepage()`
   - Update `/hot-deals` page to use CMS API
   - This ensures the storefront always shows the latest hot deals from the database

2. **Add image upload to CMS:**
   - Currently images are stored as data URLs or URLs
   - Can be enhanced to upload files to a storage service (S3, local storage, etc.)

