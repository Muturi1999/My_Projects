// ecommerce-frontend/src/app/account/orders/page.tsx

import api from '@/lib/api';
import Link from 'next/link';
// Define a simple Order type based on Django's OrderSerializer

const fetchOrders = async () => {
  // NOTE: Requires token to be sent in the request header (handled by Axios interceptor/server-side header modification in Next.js)
  const response = await api.get('/orders/');
  return response.data;
};

export default async function MyOrdersPage() {
  // Fetch orders on the server (for initial load and SEO, though logged-in pages are less critical for SEO)
  const orders = await fetchOrders();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">📦 My Orders</h2>
      
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
                <th className="py-3 px-4 border-b">Order #</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Total</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 border-b text-blue-600 font-medium">{order.id}</td>
                  <td className="py-3 px-4 border-b">{new Date(order.order_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b font-bold">${order.total_amount}</td>
                  <td className="py-3 px-4 border-b">
                    <Link href={`/account/orders/${order.id}`} className="text-sm text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}