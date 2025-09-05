import { useRouter } from 'next/router';

export default function BookCard({ book }) {
  const router = useRouter();

  return (
    <div className="border rounded-xl shadow-sm hover:shadow-md transition duration-200 p-4 bg-white">
      <img
        src={book.cover_image}
        alt={book.title}
        className="w-full h-48 object-cover rounded-lg mb-3"
        onClick={() => router.push(`/books/${book.id}`)}
      />
      <h3 className="text-sm font-semibold">{book.title}</h3>
      <p className="text-xs text-gray-500">{book.author}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-indigo-600">₹{book.price}</span>
        <button
          className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
          onClick={() => alert('Add to cart functionality')}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
