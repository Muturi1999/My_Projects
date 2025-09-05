import { useEffect, useState } from 'react';
import API from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    const res = await API.get('/books/categories/');
    setCategories(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/books/categories/', { name });
      toast.success('Category created!');
      setName('');
      fetchCategories();
    } catch (err) {
      toast.error('Error creating category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

        <form onSubmit={handleCreate} className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="New Category Name"
            className="flex-1 border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>

        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="border p-3 flex justify-between items-center rounded shadow-sm"
            >
              <span>{cat.name}</span>
              <button className="text-red-600 hover:underline" onClick={() => toast('Delete coming soon')}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
