// ecommerce-frontend/src/components/ProductGallery.tsx

'use client';
import { useState } from 'react';
// import ReactImageMagnify from 'react-image-magnify'; // Conceptual library

const images = [/* array of image URLs, first one is default */];

export default function ProductGallery({ productImages }) {
  const [mainImage, setMainImage] = useState(productImages[0].url);

  return (
    <div className="flex">
      {/* Thumbnail Selector */}
      <div className="flex flex-col space-y-2 mr-4">
        {productImages.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`Thumbnail ${index + 1}`}
            className={`w-20 h-20 object-cover border cursor-pointer ${img.url === mainImage ? 'border-blue-600 ring-2' : 'border-gray-200'}`}
            onClick={() => setMainImage(img.url)}
          />
        ))}
      </div>
      
      {/* Main Image with Zoom/Magnification */}
      <div className="flex-grow relative overflow-hidden bg-gray-100 rounded-lg">
        {/* Conceptual Zoom Implementation: */}
        <div className='cursor-zoom-in'>
          <img 
            src={mainImage} 
            alt="Main Product Image" 
            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.1]" 
          />
        </div>
        
        {/* Conceptual Lightbox Button */}
        <button className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
          🔍 Full Screen
        </button>
      </div>
    </div>
  );
}