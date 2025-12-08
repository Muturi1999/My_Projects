'use client';

import Link from 'next/link';
import { Suspense, useCallback, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';

// ----------------------------
// Interfaces
// ----------------------------
interface ProductImage {
  image: string;
  is_main?: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  current_price: number;
  discounted_price?: number;
  price?: number;
  short_description: string;
  long_description?: string;
  stock_quantity: number;
  images: ProductImage[];
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// ----------------------------
// Product Detail Component
// ----------------------------
const ProductDetail = ({ slug }: { slug: string }) => {
  const { data, error } = useSWR(`/products/${slug}/`, api.get);

  if (!data) return <p>Loading product...</p>;
  if (error) return <p className="text-red-600">Error loading product.</p>;

  const product: Product = data.data;
  const mainImage = product.images.find(img => img.is_main) || product.images[0];
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <img
            src={`http://localhost:8000${mainImage?.image}`}
            alt={product.name}
            className="w-full h-96 object-contain"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:8000${img.image}`}
              alt={`${product.name} thumbnail ${index + 1}`}
              className="w-20 h-20 object-cover rounded cursor-pointer border hover:border-blue-600"
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-yellow-500">★★★★★</span>
          <Link href="#reviews" className="text-sm text-blue-600">
            ({Math.floor(Math.random() * 100)} Reviews)
          </Link>
        </div>

        <div className="text-4xl font-extrabold text-red-600">
          ${product.current_price}
          {product.discounted_price && (
            <span className="text-xl text-gray-400 line-through ml-4">${product.price}</span>
          )}
        </div>

        <p className="text-lg text-gray-700">{product.short_description}</p>

        <div className="flex items-center space-x-4">
          <label htmlFor="qty" className="font-medium">Quantity:</label>
          <input
            type="number"
            id="qty"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            min={1}
            max={product.stock_quantity}
            className="border p-2 w-20 text-center rounded"
          />
          <button className="bg-green-600 text-white text-xl px-8 py-3 rounded-lg hover:bg-green-700 transition">
            ➕ Add to Cart
          </button>
          <button className="bg-red-500 text-white text-xl px-8 py-3 rounded-lg hover:bg-red-600 transition">
            Buy Now
          </button>
        </div>

        <p className={product.stock_quantity > 10 ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
          {product.stock_quantity > 0 ? (product.stock_quantity > 10 ? 'In Stock' : `Low Stock - Only ${product.stock_quantity} left!`) : 'Out of Stock'}
        </p>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
          <p>🚚 Estimated delivery: 3-5 working days.</p>
          <p>↩️ Return Policy: 7-Day Money-Back Guarantee.</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Product Details</h2>
        <div
          className="border p-6 rounded-lg bg-gray-50"
          dangerouslySetInnerHTML={{ __html: product.long_description || 'No detailed description available.' }}
        />
      </section>
    </div>
  );
};

// ----------------------------
// Product Listing Component
// ----------------------------
const ProductResults = ({ searchParams }) => {
  const queryString = new URLSearchParams(searchParams).toString();
  const { data, error } = useSWR(`/products/?${queryString}`, api.get);

  if (!data) return <p className="text-center py-12">Loading products...</p>;
  if (error) return <p className="text-center py-12 text-red-600">Error fetching products.</p>;

  const products: PaginatedResponse = data.data;

  return (
    <>
      <p className="mb-4 text-sm text-gray-600">Showing {products.results.length} of {products.count} results.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.results.map(product => (
          <div key={product.id} className="border p-4 h-64">
            {product.name} - ${product.current_price}
          </div>
        ))}
      </div>
    </>
  );
};

// ----------------------------
// Filters Component
// ----------------------------
const FilterControls = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);
      router.push(pathname + '?' + params.toString(), { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="bg-gray-100 p-4 rounded-lg space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">Filters</h3>
      <div>
        <label htmlFor="category-filter" className="font-semibold block mb-2">Category</label>
        <select
          id="category-filter"
          onChange={e => updateQueryParam('category__slug', e.target.value)}
          defaultValue={searchParams.get('category__slug') || ''}
          className="w-full p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="apparel">Apparel</option>
        </select>
      </div>
    </div>
  );
};

// ----------------------------
// Sort Component
// ----------------------------
const SortControl = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('ordering', value);
    else params.delete('ordering');
    router.push(pathname + '?' + params.toString(), { scroll: false });
  };

  return (
    <div>
      <label htmlFor="sort-by" className="mr-2 text-sm font-medium">Sort By:</label>
      <select
        id="sort-by"
        onChange={handleSortChange}
        defaultValue={searchParams.get('ordering') || '-created_at'}
        className="p-2 border rounded text-sm"
      >
        <option value="-created_at">Newest Arrivals</option>
        <option value="current_price">Price: Low to High</option>
        <option value="-current_price">Price: High to Low</option>
        <option value="name">Name: A-Z</option>
      </select>
    </div>
  );
};

// ----------------------------
// Main Page Component
// ----------------------------
export default function ProductPage({ params, searchParams }: { params?: { slug?: string }, searchParams?: any }) {
  if (params?.slug) {
    return (
      <main className="container mx-auto p-4">
        <ProductDetail slug={params.slug} />
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>
      <div className="flex space-x-8">
        <aside className="w-64 flex-shrink-0">
          <FilterControls />
        </aside>
        <section className="flex-grow">
          <div className="flex justify-end mb-4">
            <SortControl />
          </div>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductResults searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
