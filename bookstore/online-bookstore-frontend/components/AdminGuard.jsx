// components/AdminGuard.jsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isAdmin } from '../lib/auth'; // Your auth helper

export default function AdminGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
}
