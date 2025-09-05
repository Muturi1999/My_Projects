import { useState } from 'react';
import API from '../lib/api';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register/', form);
      alert("Registered successfully. Please login.");
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['username', 'email', 'password'].map(field => (
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
