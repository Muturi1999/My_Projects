// ecommerce-frontend/src/components/layout/Header.tsx (Partial)

'use client';

import { useState, useEffect } from 'react';
// ... other imports

export default function Header() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Set the scroll threshold (e.g., 100 pixels)
            const shouldBeSticky = window.scrollY > 100;
            if (shouldBeSticky !== isSticky) {
                setIsSticky(shouldBeSticky);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isSticky]);
    
    // The conditional classes handle the sticky effect
    const headerClasses = `
        w-full transition-all duration-300 z-50 shadow-md 
        ${isSticky ? 'fixed top-0 bg-white/95 backdrop-blur-sm py-3' : 'relative bg-white py-4'}
    `;

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* ... Logo, Mega Menu, Account Dropdown (Existing Components) ... */}
                
                {/* Search Component */}
                <SearchAutocomplete /> 
            </div>
        </header>
    );
}