// File: pages/admin/dashboard.jsx
import { useEffect, useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    orders: 0,
    sales: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, usersRes, ordersRes] = await Promise.all([
          axios.get('/api/admin/books/count'),
          axios.get('/api/admin/users/count'),
          axios.get('/api/admin/orders/summary'),
        ]);

        setStats({
          books: booksRes.data.count,
          users: usersRes.data.count,
          orders: ordersRes.data.count,
          sales: ordersRes.data.totalSales,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Books" value={stats.books} />
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Total Orders" value={stats.orders} />
          <StatCard title="Weekly Sales" value={`KES ${stats.sales}`} />
        </div>
      </div>
    </AdminGuard>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-gray-600 text-sm">{title}</h2>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
