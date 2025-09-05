import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import axios from '@/lib/axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function UploadBook() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    coverImage: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/admin/books/', form);
      toast.success('Book uploaded successfully!');
      router.push('/admin/books');
    } catch (err) {
      toast.error('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Upload Book">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input name="author" value={form.author} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input name="category" value={form.category} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input name="price" value={form.price} onChange={handleChange} required type="number" />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input name="stock" value={form.stock} onChange={handleChange} required type="number" />
        </div>
        <div>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input name="coverImage" value={form.coverImage} onChange={handleChange} required />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Book'}
        </Button>
      </form>
    </AdminLayout>
  );
}
