// ecommerce-frontend/src/app/admin/orders/page.tsx

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

// ----------------------------
// Fetch Functions
// ----------------------------
const fetchAllOrders = async () => {
    // Admin endpoint that returns all orders
    const response = await api.get('/orders/'); 
    return response.data;
};

// Status choices for dropdowns
const STATUS_CHOICES = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded'
];

// ----------------------------
// Admin Order Management Page
// ----------------------------
export default function AdminOrderManagementPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]); // IDs of selected orders

    // ----------------------------
    // Load Orders
    // ----------------------------
    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // ----------------------------
    // Handle single order status change
    // ----------------------------
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const response = await api.patch(`/orders/${orderId}/update_status/`, { status: newStatus });
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: response.data.status } : order
            ));
        } catch (error) {
            alert('Failed to update order status.');
        }
    };

    // ----------------------------
    // Handle order selection for bulk actions
    // ----------------------------
    const handleSelectOrder = (orderId: number) => {
        setSelectedOrders(prev => 
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(order => order.id));
        }
    };

    // ----------------------------
    // Bulk Status Update
    // ----------------------------
    const handleBulkStatusUpdate = async (newStatus: string) => {
        if (selectedOrders.length === 0) return alert('Select orders first.');

        try {
            await api.patch('/orders/bulk_update_status/', { 
                order_ids: selectedOrders, 
                status: newStatus 
            });
            alert(`Updated ${selectedOrders.length} orders to ${newStatus}.`);
            loadOrders();
            setSelectedOrders([]);
        } catch (error) {
            alert('Bulk update failed.');
        }
    };

    // ----------------------------
    // Refund Action
    // ----------------------------
    const handleRefund = async (orderId: number) => {
        if (!confirm(`Are you sure you want to process a full refund for Order ${orderId}?`)) return;

        try {
            // NOTE: In a real app, fetch exact amount from order
            const mockAmount = 100.00;

            await api.post('/admin/orders/refund/', { 
                order_id: orderId, 
                amount: mockAmount 
            });
            alert(`Order ${orderId} refunded.`);
            loadOrders();
        } catch (error) {
            alert('Refund failed.');
        }
    };

    if (loading) return <p>Loading orders...</p>;

    return (
        <section>
            <h2 className="text-3xl font-bold mb-6">📋 Order Management ({orders.length} Total)</h2>

            {/* Bulk Actions Dropdown */}
            <div className="flex items-center space-x-4 mb-4">
                <p>{selectedOrders.length} selected.</p>
                <select 
                    onChange={(e) => handleBulkStatusUpdate(e.target.value)} 
                    className="p-2 border rounded"
                    disabled={selectedOrders.length === 0}
                >
                    <option value="">Bulk Change Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">
                                <input 
                                    type="checkbox" 
                                    checked={selectedOrders.length === orders.length} 
                                    onChange={handleSelectAll} 
                                />
                            </th>
                            <th className="p-2 border">Order ID</th>
                            <th className="p-2 border">Customer</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Total Amount</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-2 border">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => handleSelectOrder(order.id)}
                                    />
                                </td>
                                <td className="p-2 border">{order.id}</td>
                                <td className="p-2 border">{order.full_name}</td>
                                <td className="p-2 border">{order.email}</td>
                                <td className="p-2 border">${order.total_amount.toFixed(2)}</td>
                                <td className="p-2 border">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="p-1 border rounded text-sm"
                                    >
                                        {STATUS_CHOICES.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2 border space-x-2">
                                    <button 
                                        onClick={() => window.open(`/api/admin/orders/${order.id}/invoice/`, '_blank')} 
                                        className="text-sm text-indigo-600 hover:underline"
                                    >
                                        Invoice
                                    </button>
                                    {order.status !== 'Refunded' && (
                                        <button 
                                            onClick={() => handleRefund(order.id)} 
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            Refund
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
