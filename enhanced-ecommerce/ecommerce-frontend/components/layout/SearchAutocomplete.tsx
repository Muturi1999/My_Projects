// ecommerce-frontend/src/components/layout/SearchAutocomplete.tsx

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchAutocomplete() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    // Debounce function to limit API calls
    const debounceSearch = useCallback(
        debounce(async (searchQuery) => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/search/suggest/?q=${searchQuery}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Search suggestion failed:", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300), // 300ms debounce
        [] // Empty dependency array means this function is only created once
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setLoading(true);
        debounceSearch(value);
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // Redirect to the full search results page
            router.push(`/products?search=${encodeURIComponent(query)}`);
            setSuggestions([]); // Clear suggestions
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-lg mx-auto" ref={containerRef}>
            <form onSubmit={handleSearchSubmit} className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 transition">
                <input
                    type="search"
                    placeholder="Search products, brands, and categories..."
                    value={query}
                    onChange={handleChange}
                    className="w-full p-2.5 outline-none text-base"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 hover:bg-blue-700 transition">
                    🔍
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {(loading || suggestions.length > 0) && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {loading && query.length >= 3 ? (
                        <div className="p-3 text-center text-gray-500">Loading...</div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((p, index) => (
                            <Link 
                                key={index} 
                                href={`/product/${p.slug}`} 
                                onClick={() => setSuggestions([])}
                                className="flex justify-between items-center p-3 hover:bg-gray-100 border-b last:border-b-0"
                            >
                                <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                                <span className="text-sm text-blue-600 font-semibold">${p.price}</span>
                            </Link>
                        ))
                    ) : (
                        query.length >= 3 && <div className="p-3 text-center text-gray-500">No products found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

// Basic Debounce Utility Function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}