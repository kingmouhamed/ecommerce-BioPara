"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, MessageCircle, ArrowRight, Heart, Shield, Award } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useToast } from './ui/Toast';

interface EnhancedProductCardProps {
  product: Product;
  className?: string;
}

export default function EnhancedProductCard({ product, className = '' }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      brand: product.brand,
      inStock: product.inStock
    }, 1);
    
    addToast({
      type: 'success',
      title: 'تمت الإضافة للسلة',
      message: `${product.title} تمت إضافته بنجاح`
    });
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const message = `مرحباً، أود طلب المنتج: ${product.title}\nالسعر: ${product.price} درهم\nالرابط: ${window.location.href}/products/${product.id}`;
    const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getCategoryBadgeInfo = (category: string) => {
    const catLower = category?.toLowerCase() || '';
    if (catLower.includes('herb')) return { label: 'أعشاب طبية', color: 'bg-green-100 text-green-800' };
    if (catLower.includes('oil')) return { label: 'زيوت طبية', color: 'bg-amber-100 text-amber-800' };
    if (catLower.includes('supplement')) return { label: 'مكملات غذائية', color: 'bg-blue-100 text-blue-800' };
    return { label: 'منتج مميز', color: 'bg-gray-100 text-gray-800' };
  };

  const badgeInfo = getCategoryBadgeInfo(product.category);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className={`group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex gap-2">
        {product.badge && (
          <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {product.badge}
          </span>
        )}
        {hasDiscount && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Category Badge */}
      <div className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold ${badgeInfo.color}`}>
        {badgeInfo.label}
      </div>

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-50"></div>
        
        <Image
          src={product.image || '/images/placeholder.svg'}
          alt={product.title}
          fill
          className={`object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Quick Actions Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              أضف للسلة
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              واتساب
            </button>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute top-3 left-3 z-20 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add to wishlist logic here
          }}
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Brand */}
        {product.brand && (
          <div className="text-xs text-gray-500 mb-1 font-medium">{product.brand}</div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (product.rating || 5)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl font-black text-emerald-600">
            {product.price} ر.س
          </div>
          {hasDiscount && (
            <div className="text-sm text-gray-500 line-through">
              {product.originalPrice} ر.س
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${
            product.inStock ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            product.inStock ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.inStock ? 'متوفر' : 'نفد المخزون'}
          </span>
          {product.stockCount && product.inStock && (
            <span className="text-xs text-gray-500">
              ({product.stockCount} قطعة)
            </span>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>ضمان الجودة</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Award className="w-3 h-3" />
            <span>معتمد</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
