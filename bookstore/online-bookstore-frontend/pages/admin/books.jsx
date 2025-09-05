// pages/admin/books.jsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/books/books/').then(res => {
      setBooks(res.data.results);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await API.delete(`/books/books/${id}/`);
      setBooks(books.filter(book => book.id !== id));
    }
  };

  return (
    <AdminLayout title="Manage Books">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Books</h1>
        <Link href="/admin/upload">
          <Button>Add New Book</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(book => (
            <Card key={book.id} className="p-4 relative">
              {book.inventory === 0 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Sold Out</span>
              )}
              <img
                src={book.image}
                alt={book.title}
                className="h-48 w-full object-cover rounded mb-2"
              />
              <h2 className="font-bold text-lg">{book.title}</h2>
              <p className="text-sm text-gray-600">By {book.author}</p>
              <p className="text-green-700 font-semibold mb-2">
                ${book.discount_price || book.price}
              </p>
              <div className="flex justify-between gap-2">
                <Link href={`/admin/edit-book/${book.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Link href={`/book/${book.id}`} target="_blank">
                  <Button variant="outline">View</Button>
                </Link>
                <Button variant="destructive" onClick={() => handleDelete(book.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
