// ecommerce-frontend/src/app/admin/dashboard/page.tsx

'use client';

import api from '@/lib/api';
import { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // Optional charting library

// ----------------------------
// Metric Card Component
// ----------------------------
const MetricCard = ({ title, value }) => (
    <div className="bg-white p-5 rounded-lg shadow-lg border-l-4 border-indigo-500">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
);

// ----------------------------
// Fetching Functions
// ----------------------------
const fetchMetrics = async () => {
    const response = await api.get('/admin/metrics/');
    return response.data;
};

const fetchLowStockAlerts = async () => {
    const response = await api.get('/admin/inventory/low_stock/');
    return response.data;
};

// ----------------------------
// Admin Dashboard Page
// ----------------------------
export default function AdminDashboardPage() {
    const [metrics, setMetrics] = useState(null);
    const [lowStockAlerts, setLowStockAlerts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [metricsData, lowStockData] = await Promise.all([
                    fetchMetrics(),
                    fetchLowStockAlerts()
                ]);
                setMetrics(metricsData);
                setLowStockAlerts(lowStockData);
            } catch (error) {
                console.error("Failed to load admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <p>Loading dashboard data...</p>;
    if (!metrics) return <p>Could not load metrics.</p>;

    const formatChartData = (data) => data.map(item => ({
        day: new Date(item.day).toLocaleDateString(),
        Revenue: parseFloat(item.revenue)
    }));

    return (
        <section>
            {/* ----------------------------
                Sales Overview Section
            ---------------------------- */}
            <h2 className="text-3xl font-bold mb-6">📊 Sales Overview</h2>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard title="Total Revenue" value={`$${metrics.total_revenue}`} />
                <MetricCard title="Total Orders" value={metrics.total_orders} />
                <MetricCard 
                    title="Avg. Order Value" 
                    value={`$${(metrics.total_revenue / metrics.total_orders).toFixed(2)}`} 
                />
            </div>

            {/* Daily Revenue Chart Placeholder */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold mb-4">Daily Revenue Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                    {/* Chart implementation can be added here */}
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white p-6 border rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4">Top 10 Products by Quantity Sold</h3>
                <ol className="list-decimal list-inside space-y-1">
                    {metrics.top_products.map((p, index) => (
                        <li key={index} className="flex justify-between border-b pb-1">
                            <span>{p.product__name}</span>
                            <span className="font-medium text-indigo-600">{p.total_sold} units</span>
                        </li>
                    ))}
                </ol>
            </div>

            {/* ----------------------------
                Inventory Alerts Section
            ---------------------------- */}
            <h2 className="text-3xl font-bold mb-6 mt-8">🚨 Inventory Alerts</h2>

            {lowStockAlerts && (
                <div className="bg-yellow-50 p-6 border border-yellow-300 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-800">
                        {lowStockAlerts.products.length + lowStockAlerts.variants.length} Items Below Threshold ({lowStockAlerts.threshold})
                    </h3>

                    {lowStockAlerts.products.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-bold text-yellow-700">Base Products:</h4>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                {lowStockAlerts.products.map(p => (
                                    <li key={p.id}>
                                        {p.name} - <strong>{p.stock_quantity}</strong> units left.
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lowStockAlerts.variants.length > 0 && (
                        <div>
                            <h4 className="font-bold text-yellow-700">Product Variants:</h4>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                {lowStockAlerts.variants.map(v => (
                                    <li key={v.id}>
                                        {v.product__name} ({v.sku}) - <strong>{v.stock_quantity}</strong> units left.
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
