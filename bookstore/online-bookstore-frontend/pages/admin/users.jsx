import { useEffect, useState } from 'react';
import API from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/accounts/users/').then(res => setUsers(res.data));
  }, []);

  return (
    <AdminLayout title="Manage Users">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="text-sm text-gray-700 border-t">
                <td className="p-2">{user.full_name || user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone_number || '-'}</td>
                <td>{user.is_staff ? 'Admin' : 'User'}</td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
