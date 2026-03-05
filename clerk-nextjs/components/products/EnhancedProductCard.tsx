"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, MessageCircle, Heart, Shield, Award } from 'lucide-react';
import { Product } from '@/lib/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '../ui/Toast';

interface EnhancedProductCardProps {
  product: Product;
  className?: string;
}

export default function EnhancedProductCard({ product, className = '' }: EnhancedProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      title: product.name_ar || product.name,
      price: product.price,
      image: (product.images && product.images.length > 0) ? product.images[0] : product.image_url || '/images/products/product-placeholder.jpg',
      brand: 'BioPara',
      inStock: product.stock > 0,
      slug: product.slug
    }, 1);

    addToast({
      type: 'success',
      title: 'تمت الإضافة للسلة',
      message: `${product.name_ar || product.name} تمت إضافته بنجاح`
    });
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = "212673020264";
    const message = `السلام عليكم، أود طلب المنتج التالي:\n\n*المنتج:* ${product.name_ar || product.name}\n*السعر:* ${product.price} درهم\n\nهل هذا المنتج متوفر؟`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  const getCategoryBadgeInfo = (category: string) => {
    const catLower = category?.toLowerCase() || '';
    if (catLower.includes('herb')) return { label: 'أعشاب طبية', color: 'bg-green-100 text-green-800' };
    if (catLower.includes('oil')) return { label: 'زيوت طبية', color: 'bg-amber-100 text-amber-800' };
    if (catLower.includes('supplement')) return { label: 'مكملات غذائية', color: 'bg-blue-100 text-blue-800' };
    return { label: 'منتج مميز', color: 'bg-gray-100 text-gray-800' };
  };

  const badgeInfo = getCategoryBadgeInfo(product.categories?.name_ar || product.categories?.name || '');

  return (
    <div
      className={`group flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative ${className}`}
    >
      <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-0" aria-label={product.name_ar || product.name} />

      {/* Category Badge */}
      <div className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold ${badgeInfo.color} pointer-events-none`}>
        {badgeInfo.label}
      </div>

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-50 pointer-events-none z-0"></div>

        <Image
          src={(product.images && product.images.length > 0) ? product.images[0] : product.image_url || '/images/products/product-placeholder.jpg'}
          alt={product.name_ar || product.name}
          fill
          className={`object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} group-hover:scale-110 pointer-events-none z-10`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Quick Actions Overlay (Mobile: Always Visible | Desktop: Visible on Hover) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex gap-2 opacity-100 translate-y-0 transition-all duration-300 md:opacity-0 md:translate-y-full md:group-hover:opacity-100 md:group-hover:translate-y-0 z-30 pointer-events-auto">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            أضف للسلة
          </button>
          <button
            onClick={handleWhatsAppOrder}
            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            واتساب
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          title="أضف للمفضلة"
          className="absolute top-3 left-3 z-30 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToast({ type: 'success', title: 'تمت الإضافة للمفضلة', message: 'تم حفظ المنتج في قائمة المفضلة' });
          }}
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1 pointer-events-none relative z-20">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
          {product.name_ar || product.name}
        </h3>

        {/* Description */}
        {product.description_ar && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.description_ar || product.description}
          </p>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">(0)</span>
        </div>

        {/* Price & Stock */}
        <div className="mt-auto">
          <div className="text-2xl font-black text-emerald-600 mb-2">
            {product.price} درهم
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? 'متوفر' : 'نفد المخزون'}
            </span>
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
      </div>
    </div>
  );
}

