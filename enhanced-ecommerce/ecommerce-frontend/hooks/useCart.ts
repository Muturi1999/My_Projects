// ecommerce-frontend/src/hooks/useCart.ts (Conceptual file)

import api from '../lib/api';
import { useState } from 'react';

// Simplified Cart/CartItem interfaces
interface CartItem {
    id: number;
    product: { name: string; current_price: string; slug: string };
    quantity: number;
    total_price: string;
}

interface Cart {
    id: number;
    items: CartItem[];
    subtotal: string;
    item_count: number;
}

export const useCart = () => {
    const [cart, setCart] = useState<Cart | null>(null);

    // 1. Fetch Cart (Used for Mini Cart and Full Cart Page)
    const fetchCart = async () => {
        // NOTE: This uses cookies/session to identify the guest cart 
        // which must be configured for axios/Django to share session state.
        const response = await api.get('/cart/1/'); // The Django ViewSet handles fetching the correct cart instance.
        setCart(response.data);
    };

    // 2. Add to Cart (Ajax) - Used by Product Card and Product Detail Page
    const addToCart = async (productId: number, quantity: number = 1) => {
        const response = await api.post('/cart/add/', { product_id: productId, quantity });
        setCart(response.data);
        // Show Mini Cart (Dropdown/Slide-in) here
        console.log("Product added! Mini Cart should show now.", response.data);
        return true;
    };

    // 3. Update Cart (Ajax) - Used by Full Cart Page
    const updateItemQuantity = async (itemId: number, quantity: number) => {
        const response = await api.patch(`/cart/update/${itemId}/`, { quantity });
        setCart(response.data);
    };

    // 4. Remove from Cart (Ajax) - Used by Full Cart Page
    const removeItem = async (itemId: number) => {
        await api.delete(`/cart/remove/${itemId}/`);
        fetchCart(); // Re-fetch or update state locally
    };

    return { cart, fetchCart, addToCart, updateItemQuantity, removeItem };
};