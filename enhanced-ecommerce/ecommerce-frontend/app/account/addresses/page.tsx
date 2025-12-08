// ecommerce-frontend/src/app/account/addresses/page.tsx

'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
// Assuming Address type is defined based on accounts/models.py

const fetchAddresses = async () => {
    const response = await api.get('/addresses/');
    return response.data;
};

export default function AddressBookPage() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false); // Toggle form state

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const data = await fetchAddresses();
                setAddresses(data);
            } catch (error) {
                console.error("Failed to load addresses:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAddresses();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/addresses/${id}/`);
            setAddresses(addresses.filter(addr => addr.id !== id));
        } catch (error) {
            alert('Failed to delete address.');
        }
    };
    
    if (loading) return <p>Loading addresses...</p>;

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">🏠 Address Book</h2>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    + Add New Address
                </button>
            </div>

            {/* Address List */}
            <div className="space-y-4">
                {addresses.map((address) => (
                    <div key={address.id} className="border p-4 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{address.full_name} ({address.address_type})</p>
                            <p className="text-sm text-gray-700">{address.address_line_1}, {address.city}, {address.postal_code}</p>
                            <p className="text-sm text-gray-700">{address.country}</p>
                            {address.is_default_shipping && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default Shipping</span>}
                        </div>
                        <div className="space-x-2">
                            <button className="text-blue-600 text-sm hover:underline">Edit</button>
                            <button onClick={() => handleDelete(address.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Form for Add/Edit Address (Modal/Inline) */}
            {isAdding && (
                <div className="mt-8 border-t pt-6">
                    {/* Placeholder for Address Form component */}
                    <h3 className='text-xl font-bold mb-4'>Add New Address</h3>
                    <p className='text-gray-500'>[Detailed Form with fields for full name, phone, address lines, city, postal code, and default checkboxes]</p>
                    <button onClick={() => setIsAdding(false)} className='mt-4 text-blue-600'>Cancel</button>
                </div>
            )}
        </section>
    );
}