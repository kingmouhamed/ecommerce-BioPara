
import React from 'react';
import Image from 'next/image';
import type { Product } from '../data/products'; // Using type for interface import

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white border rounded-lg p-3 hover:shadow-lg transition group relative flex flex-col h-full">
    {product.isNew && <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">NOUVEAU</span>}
    {product.oldPrice && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">
        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
      </span>
    )}
    
    <div className="relative mb-3 overflow-hidden h-40 flex items-center justify-center p-2">
      <Image 
        src={product.image} 
        alt={product.title} 
        width={150} 
        height={150} 
        className="h-full object-contain group-hover:scale-105 transition duration-300" 
      />
      <button className="absolute bottom-0 w-full bg-emerald-700 text-white py-2 translate-y-full group-hover:translate-y-0 transition duration-300 font-bold text-sm">
        AJOUTER
      </button>
    </div>

    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wide truncate">{product.category}</div>
    <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-2 line-clamp-2 min-h-[32px] leading-tight" title={product.title}>
      {product.title}
    </h3>

    <div className="flex flex-wrap items-end gap-2 mt-auto">
      <span className="text-base font-bold text-emerald-700">{product.price.toFixed(0)} DH</span>
      {product.oldPrice && <span className="text-xs text-gray-400 line-through mb-1">{product.oldPrice.toFixed(0)} DH</span>}
    </div>
  </div>
);

export default ProductCard;
