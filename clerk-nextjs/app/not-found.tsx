"use client";

import React from "react";
import Link from "next/link";
import { Search, Home, Package } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center" dir="rtl">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">الصفحة غير موجودة</h2>
        
        <p className="text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">هل تبحث عن:</p>
            <div className="flex flex-col gap-2">
              <Link href="/products?category=parapharmacie" className="text-emerald-700 hover:text-emerald-800 text-sm flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                البارافارماسي
              </Link>
              <Link href="/products?category=medical-herbs" className="text-emerald-700 hover:text-emerald-800 text-sm flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                الأعشاب الطبية
              </Link>
              <Link href="/brands" className="text-emerald-700 hover:text-emerald-800 text-sm flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                الماركات
              </Link>
              <Link href="/promotions" className="text-emerald-700 hover:text-emerald-800 text-sm">
                العروض والخصومات
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
