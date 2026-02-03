"use client";
import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product, onAddToCart }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`
            ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          `}
        />
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-xl">
      {/* Product Image and Badges */}
      <Link href={`/products/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={product.image || '/placeholder.png?v=3'}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discountPercentage}%
          </span>
        )}
        {product.isNew && (
          <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white">
            جديد
          </span>
        )}
      </div>
      
      {/* Favorite Button */}
      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/70 text-gray-500 backdrop-blur-sm transition-all duration-300 hover:bg-red-500 hover:text-white focus:outline-none" aria-label="إضافة إلى المفضلة">
        <Heart size={20} />
      </button>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="flex-grow text-sm font-semibold text-gray-800 mb-2 h-10">
          <Link href={`/products/${product.id}`} className="hover:text-green-700">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>

        <div className="text-xs text-gray-500 mb-3 h-8">
          <p className="line-clamp-2">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          {renderStars(product.rating)}
          <span>({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-green-700">{product.price} DH</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">{product.originalPrice} DH</p>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <ShoppingCart size={18} className="mr-2" />
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

