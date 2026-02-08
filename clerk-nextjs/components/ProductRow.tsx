"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductRowProps {
  product: {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    image: string;
    category: string;
    description?: string;
    inStock?: boolean;
    badge?: string;
  };
  onQuickView?: (product: any) => void;
  onRemove?: (productId: number) => void;
  showActions?: boolean;
  showQuantity?: boolean;
  quantity?: number;
  onQuantityChange?: (productId: number, quantity: number) => void;
}

export default function ProductRow({
  product,
  onQuickView,
  onRemove,
  showActions = true,
  showQuantity = false,
  quantity = 1,
  onQuantityChange
}: ProductRowProps) {
  const { addToCart } = useCart();
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && onQuantityChange) {
      onQuantityChange(product.id, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden">
            {product.badge && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full z-10">
                -{discount}%
              </span>
            )}
            <Link href={`/products/${product.id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="mb-1">
                <span className="text-xs text-emerald-600 font-medium">{product.category}</span>
              </div>
              
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-800 mb-2 hover:text-emerald-600 transition-colors line-clamp-2">
                  {product.title}
                </h3>
              </Link>

              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

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
                {!product.inStock && (
                  <span className="text-red-500 text-sm">نفد المخزون</span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-bold text-emerald-600">{product.price} درهم</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">{product.originalPrice} درهم</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2">
              {showActions && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuickView?.(product)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="عرض سريع"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="أضف للمفضلة">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  {onRemove && (
                    <button
                      onClick={() => onRemove(product.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {showQuantity && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {showActions && !showQuantity && (
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  أضف للسلة
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
