# Fix: Next.js Dev Server Errors

## Problem

You're seeing errors because Next.js is running from the project root instead of the `frontend/` directory.

## Solution

### Step 1: Stop the Current Dev Server

Press `Ctrl+C` in the terminal where Next.js is running.

### Step 2: Clear Next.js Cache

```bash
cd /home/mike/My_Projects/guava/frontend
rm -rf .next
```

### Step 3: Start from Frontend Directory

```bash
# Make sure you're in the frontend directory
cd /home/mike/My_Projects/guava/frontend

# Verify you're in the right place
ls app  # Should show the app directory
ls components  # Should show components

# Start the dev server
npm run dev
```

## Why This Happens

Next.js looks for the `app/` directory relative to where you run the command:
- ❌ Running from root → Looks for `/home/mike/My_Projects/guava/app` (doesn't exist)
- ✅ Running from frontend → Looks for `/home/mike/My_Projects/guava/frontend/app` (exists)

## Verification

After starting from `frontend/`, you should see:
```
✓ Ready in Xms
○ Compiling / ...
```

And no errors about missing `app` directory.

## About the Button Error

The `Button is not defined` error is likely from a cached build. After:
1. Stopping the server
2. Clearing `.next` cache
3. Restarting from `frontend/`

The error should disappear. The components (`AccessoriesSection`, `AudioSection`) don't use `Button` directly - they use `PromotionalBanner` which has the correct import.

