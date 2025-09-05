// components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link href="/" className="text-xl font-bold">MyShop</Link>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
