import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../lib/api';

export default function BookDetail() {
  const { query } = useRouter();
  const [book, setBook] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (query.id) {
      API.get(`/books/books/${query.id}/`).then(res => setBook(res.data));
    }
  }, [query.id]);

  const handleRate = async () => {
    try {
      await API.post('/books/rate/', { book: book.id, rating, comment });
      alert("Rated successfully");
      setRating(0); setComment('');
    } catch (err) {
      alert("Rating failed");
    }
  };

  if (!book) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="text-gray-600">{book.author}</p>
      <p className="mt-2 text-green-700 font-semibold">${book.discount_price || book.price}</p>
      <div className="mt-4 flex gap-4 border-b pb-2">
        {['overview', 'ratings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`py-1 px-4 ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="mt-4">{book.description}</div>
      )}

      {activeTab === 'ratings' && (
        <div className="mt-4">
          <div className="flex gap-2 items-center mb-2">
            <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)}
              className="w-16 border px-2 py-1 rounded" />
            <input type="text" value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Your review..." className="flex-1 border px-2 py-1 rounded" />
            <button onClick={handleRate} className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
          </div>
          <p>Average Rating: ⭐ {book.average_rating}</p>
        </div>
      )}
    </div>
  );
}
