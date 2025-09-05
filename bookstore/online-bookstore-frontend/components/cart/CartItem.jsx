// components/cart/CartItem.jsx
import React from 'react';

export default function CartItem({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded" />
        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.author}</p>
          <p className="text-blue-600 font-bold">${item.price}</p>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 font-semibold"
      >
        Remove
      </button>
    </div>
  );
}
