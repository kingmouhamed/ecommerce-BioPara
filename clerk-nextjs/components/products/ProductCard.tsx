"use client";

import React, { useState } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Star, Package, Truck, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../ui/Toast';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  badge?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  inCart?: boolean;
  isWishlisted?: boolean;
  loading?: boolean;
  showActions?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onWishlist,
  onQuickView,
  inCart = false,
  isWishlisted = false,
  loading = false,
  showActions = true,
  className = ""
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1);
      addToast({
        type: 'success',
        title: 'تمت الإضافة للسلة',
        message: `${product.title} تمت إضافته بنجاح إلى سلة التسوق`
      });
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      addToCart(product, 1);
      window.location.href = '/checkout';
    }
  };

  const handleWishlist = () => {
    if (onWishlist) {
      onWishlist(product);
    } else {
      addToast({
        type: 'success',
        title: isWishlisted ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة',
        message: `${product.title} ${isWishlisted ? 'تمت إزالته' : 'تمت إضافته'} ${isWishlisted ? 'من' : 'إلى'} المفضلة`
      });
    }
  };

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product);
    } else {
      addToast({
        type: 'info',
        title: 'عرض سريع',
        message: `عرض تفاصيل ${product.title}`
      });
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group ${className}`}>
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            {product.badge}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <Link href={`/products/${product.id}`}>
          <div className="relative h-48 bg-gray-100">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            ) : (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </Link>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-medium">نفد المخزون</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleQuickView}
              className="bg-white p-2 rounded-full shadow-md hover:bg-emerald-50 transition-colors"
              title="عرض سريع"
            >
              <Search className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleWishlist}
              className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
              title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="space-y-2">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.subcategory || product.category}
            </span>
            <div className="flex items-center space-x-1 space-x-reverse">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 mr-2">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toFixed(2)} د.م
                </span>
              )}
              <span className="text-lg font-bold text-emerald-600">
                {product.price.toFixed(2)} د.م
              </span>
            </div>
            
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>متوفر {product.stockCount || 0} قطعة</span>
            <Truck className="w-3 h-3" />
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || loading}
              className={`flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse ${
                inCart ? 'bg-gray-600 hover:bg-gray-700' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  <span>جاري التحميل...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{inCart ? 'في السلة' : 'أضف للسلة'}</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg font-medium hover:bg-emerald-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
            >
              <ArrowRight className="w-4 h-4" />
              <span>اشتر الآن</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
