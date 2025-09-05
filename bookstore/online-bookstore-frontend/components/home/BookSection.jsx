// components/home/BookSection.jsx
import BookCard from '@/components/BookCard';

export default function BookSection({ title, books }) {
  if (!books || books.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
