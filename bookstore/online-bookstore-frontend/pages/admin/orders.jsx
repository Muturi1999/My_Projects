import { useEffect, useState } from 'react';
import API from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders/all/').then(res => setOrders(res.data));
  }, []);

  return (
    <AdminLayout title="View Orders">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Orders</h1>
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Books</th>
              <th>Ordered On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="text-sm border-t">
                <td className="p-2">{order.user?.email}</td>
                <td>${order.total_price.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.items.length}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
