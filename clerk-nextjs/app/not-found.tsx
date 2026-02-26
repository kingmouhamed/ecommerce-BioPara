"use client";

import React from 'react';
import { Search, Package, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">الصفحة غير موجودة</h2>
          <p className="text-gray-600 mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة. قد يكون الرابط غير صحيح أو تم حذف الصفحة.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ماذا تريد أن تفعل؟</h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="flex items-center justify-center space-x-2 space-x-reverse text-emerald-600 hover:text-emerald-700 py-2 px-4 rounded-lg border border-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span>العودة إلى الصفحة الرئيسية</span>
              </Link>
              
              <Link
                href="/products"
                className="flex items-center justify-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-900 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>تصفح المنتجات</span>
              </Link>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">هل تحتاجر مساعدة؟</h3>
            <p className="text-emerald-700 mb-4">
              يمكنك التواصل مع فريق الدعم للحصول على المساعدة في العثور على ما تبحث عنه.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 space-x-reverse text-emerald-600 hover:text-emerald-700 font-medium"
            >
              تواصل مع الدعم
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">روابط سريعة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/category/supplements"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              المكملات الغذائية
            </Link>
            <Link
              href="/category/herbs"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              الأعشاب الطبية
            </Link>
            <Link
              href="/category/oils"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              الزيوت الطبية
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              من نحن
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              اتصل بنا
            </Link>
            <Link
              href="/faq"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              الأسئلة الشائعة
            </Link>
            <Link
              href="/cart"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              سلة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
