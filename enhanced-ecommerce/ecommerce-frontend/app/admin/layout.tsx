// ecommerce-frontend/src/app/admin/layout.tsx

import Link from 'next/link';
// Conceptual: Check user role (is_staff flag in JWT payload)
// import { useAuth } from '@/hooks/useAuth'; 

export default function AdminLayout({ children }) {
    // const { user } = useAuth();
    // if (!user || !user.is_staff) router.push('/login'); // Redirect unauthorized users

    // const navItems = [
    //     { name: 'Dashboard Home', href: '/admin/dashboard' },
    //     { name: 'Order Management', href: '/admin/orders' },
    //     { name: 'Product Builder', href: '/admin/products' }, // CRUD for products
    //     { name: 'Category Management', href: '/admin/categories' }, 
    // ];
    const navItems = [
    { name: 'Dashboard Home', href: '/admin/dashboard' },
    { name: 'Order Management', href: '/admin/orders' },
    { name: 'Product Builder', href: '/admin/products' },
    { name: '--- Content ---', separator: true }, // Visual separator
    { name: 'Blog Posts', href: '/admin/content/posts' },
    { name: 'Static Pages', href: '/admin/content/pages' },
    { name: 'Category Management', href: '/admin/categories' }, 
];

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-extrabold mb-8 text-indigo-700">👑 Admin Panel</h1>
            <div className="flex space-x-8">
                <nav className="w-64 flex-shrink-0 bg-indigo-800 p-4 rounded-lg text-white">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="block p-2 rounded hover:bg-indigo-700 transition-colors">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <main className="flex-grow bg-white p-6 border rounded-lg shadow-xl">
                    {children}
                </main>
            </div>
        </div>
    );
}