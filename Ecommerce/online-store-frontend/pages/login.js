import { useState } from 'react';
import API from '../lib/api';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/token/', form);
      localStorage.setItem('token', res.data.access);
      alert("Login successful");
      router.push('/');
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['username', 'password'].map(field => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        ))}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
