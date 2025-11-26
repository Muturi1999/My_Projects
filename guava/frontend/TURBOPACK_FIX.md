# Fix Turbopack Root Directory Error

## Problem

Turbopack is trying to infer the workspace root but it's looking in the wrong place (`frontend/app` instead of `frontend`).

## Solution

### Option 1: Use Standard Next.js (Recommended)

Instead of Turbopack, use the standard Next.js compiler:

```bash
cd /home/mike/My_Projects/guava/frontend
NEXT_PRIVATE_SKIP_TURBO=1 bun run dev
```

Or update `package.json`:

```json
{
  "scripts": {
    "dev": "NEXT_PRIVATE_SKIP_TURBO=1 next dev",
    "dev:turbo": "next dev"
  }
}
```

### Option 2: Fix Turbopack Root

If you want to use Turbopack, ensure you're running from the correct directory:

```bash
# Make sure you're in frontend directory
cd /home/mike/My_Projects/guava/frontend

# Clear cache
rm -rf .next

# Verify structure
ls package.json  # Should exist
ls app/         # Should exist
ls node_modules/next  # Should exist

# Start dev server
bun run dev
```

### Option 3: Create a Workspace Root File

Create a `package.json` at the project root that references the frontend:

```json
{
  "name": "guava-workspace",
  "private": true,
  "workspaces": [
    "frontend"
  ]
}
```

But this is usually not necessary for Next.js.

## Quick Fix

The simplest solution is to skip Turbopack for now:

```bash
cd /home/mike/My_Projects/guava/frontend
NEXT_PRIVATE_SKIP_TURBO=1 bun run dev
```

This will use the standard webpack-based compiler which is more stable.

