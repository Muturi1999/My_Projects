import Layout from '@/layouts/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BookDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${id}/`)
      .then((res) => res.json())
      .then(setBook)
      .catch(console.error);
  }, [id]);

  if (!book) return <Layout><div className="text-center mt-20">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <img src={book.cover_image} className="w-full rounded-xl shadow-md" />
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-sm text-gray-500 mb-2">By {book.author}</p>
            <p className="text-lg font-semibold text-indigo-600 mb-4">₹{book.price}</p>

            <div className="flex gap-2 mb-4">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">In Stock</span>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{book.rating}★</span>
            </div>

            <p className="text-sm text-gray-700 mb-6">{book.description}</p>

            <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Add to Cart</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
