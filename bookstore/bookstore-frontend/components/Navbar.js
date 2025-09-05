import Link from 'next/link';
import { useAuth } from '../store/auth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">BookStore</Link>

        <div className="flex gap-4 items-center text-sm font-medium">
          <Link href="/books">Books</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/bookmarks">Bookmarks</Link>
          {user ? (
            <>
              <Link href="/account">My Account</Link>
              <button onClick={logout} className="text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
