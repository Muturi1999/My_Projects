import Layout from '@/layouts/Layout';
import BookCard from '@/components/BookCard';
import { useEffect, useState } from 'react';
import { fetchAllBooks } from '@/lib/api';

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await fetchAllBooks();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Explore All Books</h1>

        {loading ? (
          <p className="text-center">Loading books...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
