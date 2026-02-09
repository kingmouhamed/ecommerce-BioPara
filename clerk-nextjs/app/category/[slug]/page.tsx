"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductList from "../../../components/ProductList";
import { mockProducts } from "../../../data/index";
import { getCategoryNameFromSlug } from "./categoryUtils";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const categoryName = getCategoryNameFromSlug(slug);

  // Filter products by category
  const categoryProducts = mockProducts.filter(product => 
    product.category === categoryName
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعتنا المختارة من أفضل منتجات {categoryName}
          </p>
        </div>

        {/* Products */}
        <ProductList 
          products={categoryProducts}
        />
        
        {categoryProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد منتجات في هذا القسم حالياً
            </h3>
            <p className="text-gray-500 mb-6">
              جرب استكشاف الأقسام الأخرى أو العودة لاحقاً
            </p>
            <Link
              href="/products"
              className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
