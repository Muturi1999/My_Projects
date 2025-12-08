// ecommerce-frontend/src/components/ReviewForm.tsx

'use client';
import { useState } from 'react';
import api from '@/lib/api';

const StarRating = ({ rating, setRating }) => { /* ... simplified star input component ... */ };

export default function ReviewForm({ productId, onReviewSubmitted }) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('product', productId.toString());
        formData.append('rating', rating.toString());
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            // Must be authenticated to post a review (handled by Django permissions)
            await api.post('/reviews/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Review submitted successfully! It will appear after moderation.');
            onReviewSubmitted();
            // Clear form
        } catch (error) {
            console.error(error.response || error);
            alert('Failed to submit review. Are you logged in?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-bold">Write a Review</h3>
            <div className='flex items-center space-x-2'>
                <label className="font-medium">Rating:</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            
            <div>
                <label htmlFor="review-title" className="block mb-1">Title</label>
                <input id="review-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
            </div>

            <div>
                <label htmlFor="review-content" className="block mb-1">Review</label>
                <textarea id="review-content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} required className="w-full p-2 border rounded"></textarea>
            </div>
            
            <div>
                <label htmlFor="review-image" className="block mb-1">Upload Image (Optional)</label>
                <input id="review-image" type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" className="w-full" />
            </div>
            
            <button type="submit" disabled={loading || rating === 0} className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition disabled:bg-gray-400">
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}