import { useEffect, useState } from 'react';
import API from '../lib/api';
import { useAuth } from '../store/auth';
import { useRouter } from 'next/router';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      API.get('/cart/')
        .then(res => setCart(res.data))
        .catch(err => {
          console.error('Error fetching cart:', err);
        });
    }
  }, [isAuthenticated]);

  const handleRemove = (id) => {
    API.delete(`/cart/remove/${id}/`).then(() => {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== id)
      }));
    });
  };

  const handleCheckout = () => {
    API.post('/orders/checkout/').then(() => {
      alert('Order placed!');
      setCart({ ...cart, items: [] });
    });
  };

  if (!cart) return <div className="p-6">Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y">
            {cart.items.map(item => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
