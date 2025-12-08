// ecommerce-frontend/src/hooks/useWishlist.ts (Conceptual)

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export const useWishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Check if the user is authenticated (Conceptual useAuth check)

    const fetchWishlist = useCallback(async () => {
        // Only fetch if authenticated
        // if (!isAuthenticated) return; 

        setLoading(true);
        try {
            const response = await api.get('/wishlist/');
            setWishlistProducts(response.data.products);
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setWishlistProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const isWished = (productId) => 
        wishlistProducts.some(p => p.id === productId);

    const toggleWishlist = async (productId) => {
        const action = isWished(productId) ? 'DELETE' : 'POST';
        
        try {
            if (action === 'DELETE') {
                await api.delete('/wishlist/', { data: { product_id: productId } });
            } else {
                await api.post('/wishlist/', { product_id: productId });
            }
            // Re-fetch or optimistically update the list
            fetchWishlist(); 
        } catch (error) {
            console.error(`Failed to ${action} product to wishlist:`, error);
            alert(`Failed to update wishlist. Please ensure you are logged in.`);
        }
    };

    return { wishlistProducts, loading, isWished, toggleWishlist, fetchWishlist };
};