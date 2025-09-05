import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '@/lib/api';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';

export default function EditBook() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    discount_price: '',
    description: '',
    inventory: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    if (id) {
      API.get(`/books/books/${id}/`)
        .then(res => setForm(res.data))
        .catch(() => toast.error('Failed to fetch book'));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await API.put(`/books/books/${id}/`, form);
      toast.success('Book updated successfully');
      router.push('/admin/books');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await API.delete(`/books/books/${id}/`);
        toast.success('Book deleted');
        router.push('/admin/books');
      } catch {
        toast.error('Deletion failed');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" />
          <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} className="input" />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="input" />
          <input type="number" name="discount_price" placeholder="Discount Price" value={form.discount_price} onChange={handleChange} className="input" />
          <input type="number" name="inventory" placeholder="Inventory" value={form.inventory} onChange={handleChange} className="input" />
          <input type="text" name="category" placeholder="Category ID" value={form.category} onChange={handleChange} className="input" />
          <input type="text" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="input" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="textarea" />

          <div className="flex gap-4">
            <button type="submit" className="btn-primary">Update</button>
            <button type="button" className="btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
