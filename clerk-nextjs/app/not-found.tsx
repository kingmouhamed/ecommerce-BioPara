"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">الصفحة غير موجودة</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            تصفح المنتجات
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-gray-500">
          إذا كنت تعتقد أن هناك خطأ، يرجى 
          <Link href="/contact" className="text-emerald-600 hover:underline">
            التواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
