# Frontend Setup Instructions

## Important: Run from Frontend Directory

**The Next.js dev server MUST be run from the `frontend/` directory, not the project root.**

## Quick Start

```bash
# Navigate to frontend directory
cd /home/mike/My_Projects/guava/frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

## Why?

When we reorganized the project structure, all frontend code was moved to the `frontend/` directory. Next.js looks for the `app/` directory relative to where you run the command.

- ✅ **Correct:** Run from `frontend/` directory
- ❌ **Wrong:** Run from project root (`guava/`)

## Directory Structure

```
guava/
├── frontend/          ← Run npm commands from HERE
│   ├── app/          ← Next.js looks for this
│   ├── components/
│   ├── package.json
│   └── ...
└── backend/
    └── ...
```

## Common Error

If you see:
```
Error: ENOENT: no such file or directory, scandir '/home/mike/My_Projects/guava/app'
```

**Solution:** Make sure you're in the `frontend/` directory:
```bash
cd frontend
npm run dev
```

## Alternative: Root-Level Scripts (Optional)

If you want to run from the root, you can add scripts to the root `package.json`:

```json
{
  "scripts": {
    "dev": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "start": "cd frontend && npm start"
  }
}
```

But the recommended approach is to always `cd frontend` first.

