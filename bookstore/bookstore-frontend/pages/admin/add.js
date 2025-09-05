import { useState } from 'react';
import API from '../../lib/api';
import { useRouter } from 'next/router';

export default function AddBook() {
  const [form, setForm] = useState({
    title: '', author: '', description: '',
    price: '', discount_price: '', image: '', inventory: '', category: ''
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/books/books/', form);
      alert("Book added successfully!");
      router.push('/');
    } catch (err) {
      alert("Error adding book.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map((key) => (
          <input key={key}
            type="text"
            placeholder={key.replace('_', ' ')}
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required={key !== 'discount_price'}
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Book</button>
      </form>
    </div>
  );
}
