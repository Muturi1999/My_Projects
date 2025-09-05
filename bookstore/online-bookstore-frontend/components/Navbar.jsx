import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-700">BookStore</Link>
        <div className="space-x-6 text-sm font-medium">
          <Link href="/books/all">Books</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
