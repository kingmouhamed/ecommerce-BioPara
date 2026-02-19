"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    image: string;
    category: string;
    badge?: string;
    brand?: string;
  };
  onAddToCart?: (product: any) => void;
  onQuickView?: (product: any) => void;
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getCategoryLabel = (category: string) => {
    const categoryLabels: Record<string, string> = {
      'medical-herbs': 'الأعشاب الطبية',
      'Herbal Medicine': 'الأعشاب الطبية'
    };

    return categoryLabels[category] ?? category;
  };

  return (
    <div className="group bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image */}
      <div className="relative bg-gray-50 overflow-hidden">
        {product.badge && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full z-10">
            -{discount}%
          </span>
        )}

        <Link href={`/products/${product.id}`}>
          <div className="relative w-full aspect-square overflow-hidden rounded-xl">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => onQuickView?.(product)}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors"
            aria-label="عرض سريع للمنتج"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          <button
            onClick={() => onAddToCart?.(product)}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors"
            aria-label="إضافة للسلة"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors"
            aria-label="إضافة للمفضلة"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <span className="text-xs text-emerald-600 font-medium">{getCategoryLabel(product.category)}</span>
        </div>
        
        {/* Brand Logo */}
        {product.brand && (
          <div className="flex items-center gap-2 mb-2">
            {product.brand === 'CeraVe' ? (
              <Image
                src="/images/brands/cerave-logo.png"
                alt="CeraVe"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Uriage' ? (
              <Image
                src="/images/brands/uriage-logo.png"
                alt="Uriage"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Nuxe' ? (
              <Image
                src="/images/brands/nuxe-logo.png"
                alt="Nuxe"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'La Roche-Posay' ? (
              <Image
                src="/images/brands/la-roche-posay-logo.png"
                alt="La Roche-Posay"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Vichy' ? (
              <Image
                src="/images/brands/vichy-logo.png"
                alt="Vichy"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Bioderma' ? (
              <Image
                src="/images/brands/bioderma-logo.png"
                alt="Bioderma"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Avène' ? (
              <Image
                src="/images/brands/avene-logo.png"
                alt="Avène"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Mustela' ? (
              <Image
                src="/images/brands/mustela-logo.png"
                alt="Mustela"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Filorga' ? (
              <Image
                src="/images/brands/filorga-logo.png"
                alt="Filorga"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'SVR' ? (
              <Image
                src="/images/brands/svr-logo.png"
                alt="SVR"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'Eucerin' ? (
              <Image
                src="/images/brands/eucerin-logo.png"
                alt="Eucerin"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : product.brand === 'BioOriental' ? (
              <Image
                src="/images/brands/bio-oriental-logo.png"
                alt="BioOriental"
                width={100}
                height={20}
                className="h-5 object-contain"
              />
            ) : (
              <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
            )}
          </div>
        )}
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-emerald-600">{product.price} درهم</span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">{product.originalPrice} درهم</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(product)}
          className="w-full bg-emerald-600 text-white py-2 sm:py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
          أضف للسلة
        </button>
      </div>
    </div>
  );
}
