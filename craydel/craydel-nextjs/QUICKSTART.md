# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Navigate to Project
```bash
cd craydel-nextjs
```

### 2. Install Dependencies (if not already done)
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Key Files to Customize

### Content
- `data/visaPackages.ts` - Visa package listings
- `data/menuItems.ts` - Navigation menu
- `data/languages.ts` - Available languages

### Styling
- `app/globals.css` - Global styles and CSS variables
- Component files - Individual component styles

### Layout
- `app/page.tsx` - Home page
- `app/layout.tsx` - Root layout
- `components/layout/` - Layout components

## 🖼️ Adding Images

Place images in `public/images/` and reference them as:
```tsx
<Image src="/images/your-image.webp" alt="Description" />
```

## 🎯 Common Tasks

### Add a New Page
1. Create `app/your-page/page.tsx`
2. Use layout components from `components/layout/`
3. Add route to `data/menuItems.ts` if needed

### Customize Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

### Add a New Component
1. Create file in appropriate folder (`components/sections/`, `components/common/`, etc.)
2. Import and use in pages
3. Style with Tailwind classes

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)

## 🆘 Need Help?

Check the main README.md for detailed documentation and troubleshooting tips.

