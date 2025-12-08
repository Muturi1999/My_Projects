// ecommerce-frontend/src/app/page.tsx

'use client'; // Make this file client-side for interactivity (cart, buttons, loading)

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFeaturedProducts, getCategories, Product, Category } from '../lib/data';
import { useCart } from '@/hooks/useCart'; // Your cart hook (must be created)

// ========================
// PRODUCT CARD COMPONENT
// ========================
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product.id, 1); // Hardcoded quantity
      alert(`${product.name} added to cart!`);
    } catch (error) {
      alert('Failed to add product to cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-xl transition-shadow relative group">
      <Link href={`/product/${product.slug}`}>
        <img 
          src={`http://localhost:8000${product.images[0]?.image}`} 
          alt={product.name} 
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">{product.name}</h3>
        <p className="text-gray-900 font-bold">${product.current_price}</p>
      </Link>

      <button 
        onClick={handleAddToCart}
        disabled={loading || product.stock_quantity === 0}
        className={`mt-3 w-full py-2 rounded transition 
          ${product.stock_quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        {loading ? 'Adding...' : (product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart')}
      </button>

      {/* Quick View Button Placeholder */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button title="Quick View" className="p-2 bg-white rounded-full shadow hover:bg-gray-100">👁️</button>
      </div>
    </div>
  );
};

// ========================
// CATEGORY CARD COMPONENT
// ========================
const CategoryCard = ({ category }: { category: Category }) => (
  <Link href={`/shop?category=${category.slug}`} className="block relative group">
    <div className="p-4 border rounded-lg text-center bg-white hover:bg-gray-50 transition">
      <h3 className="font-bold text-xl">{category.name}</h3>
      <p className="text-sm text-gray-500">{category.product_count} Products</p>
    </div>
  </Link>
);

// ========================
// HOMEPAGE COMPONENT
// ========================
export default async function HomePage() {
  // Fetch data on server side
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <main className="container mx-auto p-4">
      {/* HERO SECTION */}
      <section className="bg-gray-100 p-10 mb-8 rounded-lg text-center">
        <h1 className="text-4xl font-extrabold mb-4">Full-width Revolution-style Slider Placeholder</h1>
        <p className="text-lg">Deal of the Day: Special Pricing Display with Countdown Timer!</p>
        <div className="flex justify-center space-x-8 mt-6 text-green-600 font-semibold">
          <span>✅ Free Delivery</span>
          <span>🔒 Payment Security</span>
          <span>🔄 7-Day Returns</span>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">✨ Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">🛍️ Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-blue-800 text-white p-10 my-12 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-2">Join our Newsletter!</h3>
        <p className="mb-4">Get 20% off your first order.</p>
        <div className="max-w-md mx-auto flex">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="p-3 flex-grow rounded-l-md text-gray-800" 
          />
          <button className="p-3 bg-red-500 rounded-r-md hover:bg-red-600 transition">
            Subscribe
          </button>
        </div>
      </section>
    </main>
  );
}
