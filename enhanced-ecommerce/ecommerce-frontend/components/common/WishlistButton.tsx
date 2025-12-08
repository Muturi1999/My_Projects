// ecommerce-frontend/src/components/common/WishlistButton.tsx

'use client';
import { useWishlist } from '@/hooks/useWishlist';
// Assuming the useWishlist hook is correctly implemented and authentication works

export default function WishlistButton({ productId }) {
    const { isWished, toggleWishlist } = useWishlist();
    const active = isWished(productId);

    const handleClick = (e) => {
        e.preventDefault(); // Prevent navigating if this is on a product card
        toggleWishlist(productId);
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-full transition-colors ${
                active 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={active ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            {active ? '❤️' : '🤍'}
        </button>
    );
}