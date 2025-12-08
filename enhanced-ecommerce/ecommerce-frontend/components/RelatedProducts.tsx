// ecommerce-frontend/src/components/RelatedProducts.tsx

'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
// Assuming you have a ProductCard component to render individual products
import ProductCard from './ProductCard'; 

interface Product {
    id: number;
    name: string;
    slug: string;
    current_price: number;
    // ... other fields for ProductCard
}

export default function RelatedProducts({ productSlug }) {
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productSlug) return;

        const fetchRelated = async () => {
            setLoading(true);
            try {
                // Use the new custom action endpoint
                const response = await api.get(`/products/${productSlug}/related/`);
                setRelated(response.data);
            } catch (error) {
                console.error("Failed to fetch related products:", error);
                setRelated([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, [productSlug]);

    if (loading) return <div className="text-center p-8">Loading recommendations...</div>;
    if (related.length === 0) return null; // Don't show the section if empty

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map(product => (
                    // ProductCard is a component that displays image, name, and price
                    <ProductCard key={product.id} product={product} /> 
                ))}
            </div>
        </div>
    );
}