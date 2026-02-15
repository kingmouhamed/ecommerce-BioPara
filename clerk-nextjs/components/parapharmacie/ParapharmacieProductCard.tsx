"use client";

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Gift } from 'lucide-react';
import type { Product } from '../../data';
import { useCart } from '../../contexts/CartContext';

type ParapharmacieProductCardProps = {
  product: Product;
};

export default function ParapharmacieProductCard({ product }: ParapharmacieProductCardProps) {
  const { addToCart } = useCart();

  const hasDiscount = typeof product.originalPrice === 'number' && product.originalPrice > product.price;

  const handleAdd = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        brand: product.brand,
        inStock: product.inStock
      },
      1
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative bg-gray-50">
        {(product.badge || product.isNew) && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Gift className="w-3.5 h-3.5" />
              {product.badge || 'عرض ترويجي'}
            </span>
          </div>
        )}

        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </div>

      <div className="p-4" dir="rtl">
        <div className="text-sm text-gray-500 mb-1 line-clamp-1">{product.brand || 'BioPara'}</div>
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.75rem]">{product.title}</h3>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            {hasDiscount && (
              <div className="text-xs text-gray-400 line-through">{product.originalPrice?.toFixed(2)} درهم</div>
            )}
            <div className="text-lg font-bold text-gray-900">
              {product.price.toFixed(2)} <span className="text-sm font-medium text-gray-600">درهم</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
            aria-label="أضف إلى السلة"
          >
            <ShoppingCart className="w-4 h-4" />
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
}
