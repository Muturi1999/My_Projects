import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API from '../../lib/api';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      API.get(`/products/${id}/`).then(res => setProduct(res.data));
    }
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={product.image} alt={product.name} className="w-full max-h-96 object-cover rounded" />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="mt-4 text-xl font-semibold">${product.price}</p>
      {product.is_sold_out ? (
        <p className="text-red-500 font-semibold mt-4">Sold Out</p>
      ) : (
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          onClick={() => {
            API.post('/cart/add/', { product_id: product.id, quantity: 1 });
            alert('Added to cart');
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
