// ecommerce-frontend/src/components/VariantSelector.tsx

'use client';
import { useState, useEffect } from 'react';
// Props will include the full list of variants and the base product price/stock

export default function VariantSelector({ variants, baseProduct }) {
    // Group variants by attribute name: { Color: [Red, Blue], Size: [S, M, L] }
    const attributes = {}; 
    
    // State to hold current selections: { 'Color': 'Red', 'Size': 'L' }
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [currentVariant, setCurrentVariant] = useState(null);

    useEffect(() => {
        // Initialization logic to set defaults and organize attributes
    }, [variants]);

    useEffect(() => {
        // Logic to find the matching variant whenever selections change
        const findMatchingVariant = () => {
            if (Object.keys(selectedAttributes).length === 0) return null;

            const matched = variants.find(variant => {
                // Check if all selected attributes are present in the variant's attributes
                return variant.attributes.every(attr => 
                    selectedAttributes[attr.attribute_name] === attr.value
                );
            });
            setCurrentVariant(matched);
        };
        findMatchingVariant();
    }, [selectedAttributes, variants]);

    const handleSelect = (attributeName, value) => {
        setSelectedAttributes(prev => ({ ...prev, [attributeName]: value }));
    };

    const displayPrice = currentVariant?.price || baseProduct.current_price;
    const displayStock = currentVariant?.stock_quantity || baseProduct.stock_quantity;

    return (
        <div className="space-y-4">
            {/* Render selector groups based on organized attributes */}
            {Object.entries(attributes).map(([name, values]) => (
                <div key={name}>
                    <h4 className="font-semibold mb-2">{name}: <span className="font-normal">{selectedAttributes[name]}</span></h4>
                    <div className="flex space-x-2">
                        {values.map(val => (
                            <button
                                key={val}
                                onClick={() => handleSelect(name, val)}
                                className={`p-2 border rounded transition ${selectedAttributes[name] === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'}`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Price and Stock Status */}
            <p className="text-3xl font-bold mt-4">${displayPrice}</p>
            <p className={`font-semibold ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {displayStock > 0 ? `In Stock (${displayStock} available)` : 'Out of Stock'}
            </p>
        </div>
    );
}