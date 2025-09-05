import Link from 'next/link';

const renderStars = (rating) => {
  return (
    <div className="flex gap-0.5 text-yellow-500 text-sm mb-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
};

export default function BookCard({ book }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg relative">
      {book.inventory === 0 && (
        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Sold Out</span>
      )}
      <img src={book.image} alt={book.title} className="w-full h-48 object-cover mb-2 rounded" />
      <h3 className="font-bold text-lg">{book.title}</h3>
      {renderStars(Math.round(book.average_rating || 0))}
      <p className="text-sm text-gray-600">{book.author}</p>
      <p className="text-green-700 font-semibold">${book.discount_price || book.price}</p>
      <Link href={`/book/${book.id}`}>
        <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">View</button>
      </Link>
    </div>
  );
}
