import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-blue-700">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <Link href="/">
        <a className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Home</a>
      </Link>
    </div>
  );
}
