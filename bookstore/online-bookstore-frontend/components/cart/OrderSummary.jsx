// components/cart/OrderSummary.jsx
import React from 'react';

export default function OrderSummary({ total, onCheckout }) {
  return (
    <div className="bg-gray-50 p-6 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button
        onClick={onCheckout}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
