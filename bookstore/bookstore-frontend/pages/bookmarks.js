import { useEffect, useState } from 'react';
import API from '../lib/api';
import BookCard from '../components/BookCard';
import Navbar from '../components/Navbar';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    API.get('/books/bookmarks/').then(res => setBookmarks(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Bookmarks</h1>
        {bookmarks.length === 0 ? (
          <p>You haven’t bookmarked any books yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarks.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </div>
    </>
  );
}
