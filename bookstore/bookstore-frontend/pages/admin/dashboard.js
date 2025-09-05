import { useEffect, useState } from 'react';
import API from '../../lib/api';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get('/admin/stats/').then(res => setStats(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-6">
          <Stat label="Total Users" value={stats.total_users} />
          <Stat label="Books Listed" value={stats.total_books} />
          <Stat label="Total Orders" value={stats.total_orders} />
          <Stat label="Pending Orders" value={stats.pending_orders} />
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800 dark:text-white">
      <p className="text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
