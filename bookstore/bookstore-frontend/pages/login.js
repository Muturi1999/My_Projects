import { useState } from 'react';
import API from '../lib/api';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/token/', form);
      localStorage.setItem('token', res.data.access);
      alert("Logged in!");
      router.push('/');
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Username"
          value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
          className="w-full border px-3 py-2 rounded" required />
        <input type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full border px-3 py-2 rounded" required />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
