"use client";

import Link from "next/link";
import { CheckCircle, Leaf, ShoppingCart } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              BioPara
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle className="w-20 h-20 text-primary-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            تم الطلب بنجاح!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            شكرا لك على طلبك. سيتم التواصل معك قريبا لتأكيد الطلب وتحديد موعد
            التوصيل.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              استمر في التسوق
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
