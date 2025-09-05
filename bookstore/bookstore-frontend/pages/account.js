import { useState, useEffect } from 'react';
import API from '../lib/api';
import Navbar from '../components/Navbar';

export default function Account() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    API.get('/orders/my/').then(res => setOrders(res.data));
  }, []);

  const handleSubscribe = () => {
    API.post('/auth/newsletter/', { email }).then(() => {
      alert("Subscribed successfully!");
      setEmail('');
    }).catch(() => alert("Failed to subscribe"));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Account</h1>
        <div className="flex space-x-4 mb-6">
          {['orders', 'newsletter'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-2 px-4 ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? <p>No orders yet.</p> : (
              <ul className="divide-y">
                {orders.map(o => (
                  <li key={o.id} className="py-3">
                    <p className="font-semibold">Order #{o.id}</p>
                    {o.items.map(i => (
                      <p key={i.id} className="text-sm ml-2 text-gray-600">• {i.product.name}</p>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'newsletter' && (
          <div className="space-y-4">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border px-3 py-2 rounded w-full"
            />
            <button onClick={handleSubscribe} className="bg-blue-600 text-white px-4 py-2 rounded">Subscribe</button>
          </div>
        )}
      </div>
    </>
  );
}
