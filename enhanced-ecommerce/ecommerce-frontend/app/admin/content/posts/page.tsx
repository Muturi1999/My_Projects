// ecommerce-frontend/src/app/admin/content/posts/page.tsx

'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminPostManagementPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            // As admin, this fetches all posts (published and draft)
            const response = await api.get('/blog/posts/'); 
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/blog/posts/${postId}/`);
            fetchPosts(); // Reload list
        } catch (error) {
            alert('Failed to delete post.');
        }
    };

    if (loading) return <p>Loading blog posts...</p>;

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">📝 Blog Post Management</h2>
                <Link href="/admin/content/posts/create" className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
                    + Create New Post
                </Link>
            </div>
            
            {/* Posts Table */}
            <table className="min-w-full bg-white border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Author</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Published</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id} className={post.status === 'DRAFT' ? 'bg-yellow-50' : ''}>
                            <td className="py-2 px-4 border-b">{post.title}</td>
                            <td className="py-2 px-4 border-b">{post.author_username}</td>
                            <td className="py-2 px-4 border-b">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${post.status === 'PUBLISHED' ? 'bg-green-200 text-green-800' : 'bg-gray-300 text-gray-800'}`}>
                                    {post.status}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b">{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'N/A'}</td>
                            <td className="py-2 px-4 border-b space-x-2">
                                <Link href={`/admin/content/posts/edit/${post.id}`} className="text-indigo-600 hover:underline">Edit</Link>
                                <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}