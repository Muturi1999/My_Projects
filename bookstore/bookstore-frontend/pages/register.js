import { useState } from 'react';
import API from '../lib/api';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', phone: '', national_id: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register/', form);
      alert("Registered successfully!");
      router.push('/login');
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['username', 'email', 'phone', 'national_id', 'password'].map(field => (
          <input key={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.replace('_', ' ').toUpperCase()}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
