// components/auth/LoginForm.jsx
import { useState } from 'react';
import API from '@/lib/api';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login/', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      alert('Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border rounded"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Login
      </button>
    </form>
  );
}
