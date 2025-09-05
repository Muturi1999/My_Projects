import { useEffect, useState } from 'react';
import API from '../lib/api';
import Navbar from '../components/Navbar';

export default function History() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders/my/').then(res => setOrders(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
        {orders.length === 0 ? (
          <p>No past purchases yet.</p>
        ) : (
          <ul className="divide-y">
            {orders.map(order => (
              <li key={order.id} className="py-4">
                <p className="font-semibold">Order #{order.id}</p>
                <ul className="ml-4 text-sm text-gray-600">
                  {order.items.map(i => (
                    <li key={i.id}>• {i.product.name} x {i.quantity}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
