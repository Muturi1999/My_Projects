// components/auth/RegisterForm.jsx
import { useState } from 'react';
import API from '@/lib/api';
import { useRouter } from 'next/router';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register/', form);
      router.push('/login');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Full Name"
        className="w-full px-4 py-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border rounded"
        onChange={handleChange}
        required
      />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
}
