// ecommerce-frontend/src/app/login/page.tsx

'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Conceptual hook
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Redirect to dashboard or homepage
    } catch (error) {
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <form onSubmit={handleSubmit} className="p-8 border rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6">Login</h2>
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-3 border rounded" />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
          Sign In
        </button>
        <Link href="/register" className="block text-center mt-4 text-sm text-blue-600">
          Don&apos;t have an account? Register
        </Link>
      </form>
    </div>
  );
}