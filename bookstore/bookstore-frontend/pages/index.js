import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '../lib/api';
import BookCard from '../components/BookCard';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(true);

  const loadBooks = async () => {
    const res = await API.get(`/books/books/?page=${page}`);
    setBooks(prev => [...prev, ...res.data.results]);
    setNext(!!res.data.next);
  };

  useEffect(() => {
    loadBooks();
  }, [page]);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 py-20 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Welcome to BookStore 📚</h1>
        <p className="text-gray-700 text-lg">Browse thousands of books, add to cart, bookmark, and more.</p>
        <div className="mt-6">
          <Link href="#book-list">
            <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Browse Books
            </button>
          </Link>
        </div>
      </div>

      {/* Book Listing */}
      <div id="book-list" className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        {next && (
          <div className="text-center mt-6">
            <button
              onClick={() => setPage(p => p + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
