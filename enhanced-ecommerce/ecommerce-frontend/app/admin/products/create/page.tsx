// ecommerce-frontend/src/app/admin/products/create/page.tsx or /edit/[slug]/page.tsx

'use client';
import { useState } from 'react';
import api from '@/lib/api';
// Assuming interfaces for Product, Image, and Variant are available

export default function ProductBuilder({ initialProduct = null }) {
    const [formData, setFormData] = useState(initialProduct || { 
        name: '', slug: '', description: '', current_price: 0, stock_quantity: 0, 
        category: '', brand: '', is_active: true, images: [], variants: []
    });
    const [loading, setLoading] = useState(false);
    const isEditing = !!initialProduct;

    const handleBaseChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // NOTE: File uploads (images) require special handling (FormData and multipart/form-data header)
        // Here we'll simulate the submission of structured data.

        try {
            if (isEditing) {
                await api.put(`/products/${formData.slug}/`, formData);
                alert('Product updated successfully!');
            } else {
                await api.post('/products/', formData);
                alert('Product created successfully!');
            }
            // Redirect to the product list/detail page
        } catch (error) {
            console.error('Product save failed:', error.response?.data || error);
            alert('Failed to save product. Check the console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Create New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Basic Information (Tabs or Sections) */}
                <div className="grid grid-cols-2 gap-6 p-6 border rounded-lg">
                    {/* Name, Slug, Description, Price, Stock, Category dropdown */}
                    <BaseInfoSection formData={formData} handleChange={handleBaseChange} />
                </div>

                {/* 2. Image Management (Multiple Images, Drag & Drop) */}
                <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">🖼️ Image Gallery</h3>
                    <ImageUploadSection formData={formData} setFormData={setFormData} />
                </div>
                
                {/* 3. Variant Management (Size, Color, Price Override) */}
                <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">✨ Product Variants</h3>
                    <VariantManagementSection formData={formData} setFormData={setFormData} />
                </div>

                <button type="submit" disabled={loading} className="bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400">
                    {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                </button>
            </form>
        </section>
    );
}

// --- Placeholder Components for complexity ---

const BaseInfoSection = ({ formData, handleChange }) => (
    <>
        <input name="name" type="text" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="col-span-2 p-3 border rounded" />
        <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} rows={4} className="col-span-2 p-3 border rounded" />
        <input name="current_price" type="number" placeholder="Price" value={formData.current_price} onChange={handleChange} required className="p-3 border rounded" />
        <input name="stock_quantity" type="number" placeholder="Stock Quantity" value={formData.stock_quantity} onChange={handleChange} required className="p-3 border rounded" />
        {/* ... Category/Brand Selects ... */}
    </>
);

const ImageUploadSection = ({ formData, setFormData }) => (
    <div className="border border-dashed p-6 text-center">
        
        <p className="mt-2 text-gray-500">Drag & drop product images here, or click to browse.</p>
        {/* Render thumbnails of current images with delete and main toggle buttons */}
    </div>
);

const VariantManagementSection = ({ formData, setFormData }) => {
    // This section needs to manage creation of new variants and assignment of AttributeValues
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">Define attribute values (e.g., Color: Red/Blue, Size: S/M/L) and link them to unique SKUs, prices, and stock levels.</p>
            {formData.variants.map((variant, index) => (
                <div key={index} className="border p-4 rounded bg-white flex space-x-4">
                    <input type="text" placeholder="SKU" defaultValue={variant.sku} className="p-2 border rounded w-1/4" />
                    <input type="number" placeholder="Stock" defaultValue={variant.stock_quantity} className="p-2 border rounded w-1/4" />
                    <p className="w-1/2">[Attribute Selector UI]</p>
                </div>
            ))}
            <button type="button" className="text-blue-600 border border-blue-600 p-2 rounded hover:bg-blue-50">+ Add New Variant</button>
        </div>
    );
};