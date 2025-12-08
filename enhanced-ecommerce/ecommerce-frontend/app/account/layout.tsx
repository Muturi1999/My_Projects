// ecommerce-frontend/src/app/account/layout.tsx

import Link from 'next/link';
import { ReactNode } from 'react';

// Use a conditional check here to ensure the user is logged in (conceptually via useAuth)
// If not logged in, redirect to /login

export default function AccountLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { name: 'Dashboard Home', href: '/account/dashboard' },
    { name: 'My Orders', href: '/account/orders' },
    { name: 'Address Book', href: '/account/addresses' },
    { name: 'Account Settings', href: '/account/settings' },
    { name: 'My Wishlist', href: '/account/wishlist' }, // Future feature
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>
      <div className="flex space-x-8">
        {/* Sidebar Navigation */}
        <nav className="w-64 flex-shrink-0">
          <ul className="bg-gray-100 p-4 rounded-lg space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="block p-2 rounded hover:bg-gray-200 transition-colors"
                  // Add logic here to highlight active link
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
                <button 
                  // onClick={logout} <-- Conceptual function from useAuth
                  className="w-full text-left p-2 rounded text-red-600 hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
            </li>
          </ul>
        </nav>
        
        {/* Main Content Area */}
        <main className="flex-grow bg-white p-6 border rounded-lg shadow-md">
          {children}
        </main>
      </div>
    </div>
  );
}