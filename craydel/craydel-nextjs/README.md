# GoFly - Next.js Travel & Visa Agency Website

A modern, fully responsive travel and visa agency website built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components. This project is a complete conversion of the original WordPress GoFly theme, maintaining all design elements and functionality while leveraging modern React patterns and performance optimizations.

## 🚀 Features

- **Modern Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **UI Components**: shadcn/ui for accessible, customizable components
- **Responsive Design**: Fully responsive across all device sizes
- **Performance Optimized**: Image optimization, code splitting, and lazy loading
- **Animations**: Smooth animations using Framer Motion
- **Type Safety**: Full TypeScript support throughout
- **Accessibility**: WCAG compliant components and semantic HTML

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Poppins, Roboto, Courgette (Google Fonts)

## 🛠️ Installation

1. **Navigate to the project directory:**
   ```bash
   cd craydel-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
craydel-nextjs/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles and Tailwind config
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── input.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── Topbar.tsx
│   │   ├── Navigation.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Footer.tsx
│   ├── sections/           # Page sections
│   │   ├── Breadcrumb.tsx
│   │   ├── VisaPackageGrid.tsx
│   │   ├── VisaPackageCard.tsx
│   │   ├── WhyChooseSection.tsx
│   │   └── ContactSection.tsx
│   └── common/             # Shared components
│       ├── LanguageSelector.tsx
│       └── ProgressScroll.tsx
├── data/                   # Data files
│   ├── visaPackages.ts
│   ├── menuItems.ts
│   └── languages.ts
├── lib/
│   └── utils.ts            # Utility functions
└── public/
    └── images/             # Static images
```

## 🎨 Components

### Layout Components
- **Header**: Main navigation with responsive mobile menu
- **Topbar**: Top bar with search, language selector, and login
- **Navigation**: Desktop navigation with dropdown menus
- **MobileMenu**: Mobile-friendly slide-out menu
- **Footer**: Footer with links and social media

### Section Components
- **Breadcrumb**: Breadcrumb navigation with background image
- **VisaPackageGrid**: Grid layout for visa packages
- **VisaPackageCard**: Individual visa package card with hover effects
- **WhyChooseSection**: Feature highlights section
- **ContactSection**: Contact form and information

### UI Components
All shadcn/ui components are fully customizable and accessible:
- Button, Card, Dialog, Dropdown Menu, Input, and more

## 🎯 Key Features Implemented

✅ Complete header with responsive navigation
✅ Topbar with search, language selector, and login
✅ Mobile menu with smooth animations
✅ Visa package grid with hover effects
✅ Why choose section with icon boxes
✅ Contact section with form
✅ Footer with links and social media
✅ Progress scroll indicator
✅ Language selector dropdown
✅ Breadcrumb navigation
✅ Responsive design for all screen sizes
✅ Image optimization with Next.js Image component
✅ Smooth animations with Framer Motion

## 🔧 Customization

### Colors
Edit `app/globals.css` to customize the color scheme using CSS variables.

### Fonts
Fonts are configured in `app/layout.tsx`. You can replace them with your preferred fonts.

### Components
All components are modular and can be easily customized. Each component is in its own file with clear props interfaces.

### Data
Update data files in the `data/` directory to modify content:
- `visaPackages.ts` - Visa package listings
- `menuItems.ts` - Navigation menu items
- `languages.ts` - Available languages

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm i -g vercel
vercel
```

## 📝 Notes

- All images should be placed in `public/images/`
- Ensure all image paths in components match the actual file names
- The project uses Next.js Image component for optimized image loading
- All components are client components where interactivity is needed
- Server components are used by default for better performance

## 🐛 Troubleshooting

### Images not loading
- Check that images are in `public/images/` directory
- Verify image paths in components match actual file names
- Ensure image file extensions are correct (.webp, .png, .svg)

### Styles not applying
- Run `npm run dev` to ensure Tailwind is compiling
- Check that `globals.css` is imported in `layout.tsx`
- Verify Tailwind classes are correct

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`
- Verify all imports are correct

## 📄 License

This project is a conversion of the GoFly WordPress theme. All design elements and assets belong to their respective owners.

## 🤝 Contributing

Feel free to customize this project to your needs. All components are modular and can be easily modified.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
