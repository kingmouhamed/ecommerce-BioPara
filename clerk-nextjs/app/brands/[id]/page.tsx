"use client";

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Package, Star, Shield } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { allProducts } from '@/data';
import { brands, Brand } from '@/data/brands';

export default function BrandDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Find brand by name (slug) or ID
  const brand = brands.find((b: Brand) => 
    b.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === id ||
    b.id === parseInt(id)
  );

  if (!brand) {
    notFound();
  }

  // Filter products by brand name
  const brandProducts = allProducts.filter(product => product.brand === brand.name);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            {/* Brand Logo */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="text-4xl font-bold text-emerald-700">{brand.name.charAt(0)}</span>
            </div>
            
            {/* Brand Name */}
            <h1 className="text-4xl font-bold mb-4">{brand.name}</h1>
            
            {/* Brand Description */}
            <p className="text-emerald-100 text-lg max-w-2xl mb-8 leading-relaxed">
              {brand.description}
            </p>
            
            {/* Brand Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">{brandProducts.length}</div>
                <div className="text-emerald-100 text-sm">منتج</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">{brand.rating}</div>
                <div className="text-emerald-100 text-sm">تقييم</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">{brand.category}</div>
                <div className="text-emerald-100 text-sm">الفئة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-emerald-600 transition-colors">
              الماركات
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">منتجات {brand.name}</h2>
          <p className="text-gray-600">
            استكشف مجموعة منتجات {brand.name} عالية الجودة
          </p>
        </div>

        {brandProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brandProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => {
                  // Add to cart functionality
                  console.log('Added to cart:', product);
                }}
                onQuickView={(product) => {
                  // Quick view functionality
                  console.log('Quick view:', product);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد منتجات حالياً</h3>
            <p className="text-gray-600 mb-6">
              لا توجد منتجات متاحة من {brand.name} في الوقت الحالي
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              تصفح جميع المنتجات
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Brand Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">جودة مضمونة</h3>
            <p className="text-gray-600 text-sm">
              جميع منتجات {brand.name} أصلية ومضمونة الجودة
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">تقييم عالٍ</h3>
            <p className="text-gray-600 text-sm">
              {brand.name} حاصل على تقييم {brand.rating} من عملائنا
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">توصيل سريع</h3>
            <p className="text-gray-600 text-sm">
              توصيل سريع لجميع منتجات {brand.name} في جميع أنحاء المغرب
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
