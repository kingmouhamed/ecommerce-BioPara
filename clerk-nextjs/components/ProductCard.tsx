"use client"; // تأكد من وجود هذا السطر في البداية

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// تأكد من مسار استيراد الأنواع والكونتيكست صحيح حسب مشروعك
import { useCart } from '../contexts/CartContext';

// تعريف النوع لضمان عدم حدوث أخطاء
interface Product {
  id: number | string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  
  // حالة للتأكد أننا في المتصفح
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white border rounded-lg p-2 hover:shadow-lg transition group relative flex flex-col h-full cursor-pointer">
        
        {/* ننتظر التحميل قبل إظهار البادجات المتغيرة */}
        {isMounted && product.isNew && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10" suppressHydrationWarning>
            جديد
          </span>
        )}

        {isMounted && product.oldPrice && (
          <span
            className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10"
            suppressHydrationWarning
          >
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
        
        <div className="relative mb-2 overflow-hidden h-32 flex items-center justify-center p-1">
          <Image 
            src={product.image} 
            alt={product.title} 
            width={120} 
            height={120} 
            className="h-full w-full object-contain group-hover:scale-105 transition duration-300" 
          />
          
          {/* الزر بصيغة div لتجنب مشاكل الروابط */}
          <div 
            role="button"
            onClick={handleAddToCart}
            className="absolute bottom-0 w-full bg-emerald-700 text-white py-1.5 translate-y-full group-hover:translate-y-0 transition duration-300 font-bold text-xs hover:bg-emerald-800 text-center cursor-pointer"
          >
            أضف للسلة
          </div>
        </div>

        <div className="text-[9px] text-gray-500 mb-1 uppercase tracking-wide truncate">
            {product.category}
        </div>
        
        <h3 className="font-bold text-gray-800 text-xs mb-2 line-clamp-2 min-h-[28px] leading-tight" title={product.title}>
          {product.title}
        </h3>

        <div className="flex flex-wrap items-end gap-1 mt-auto">
          <span className="text-sm font-bold text-emerald-700" suppressHydrationWarning>
            {product.price.toFixed(0)} DH
          </span>
          
          {/* ننتظر التحميل لإظهار السعر القديم */}
          {isMounted && product.oldPrice && (
            <span className="text-[10px] text-gray-400 line-through mb-1">
                {product.oldPrice.toFixed(0)} DH
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;