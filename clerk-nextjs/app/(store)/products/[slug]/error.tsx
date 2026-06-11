'use client'

import React from 'react'
import Link from 'next/link'
import { Home, Search, ArrowRight } from 'lucide-react'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-32 h-32 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-8">
          <div className="text-4xl">⚠️</div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">حدث خطأ في تحميل المنتج</h1>
        <p className="text-xl text-gray-600 mb-8">
          {error.message || 'عذراً، حدث خطأ أثناء تحميل تفاصيل المنتج'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all"
          >
            إعادة المحاولة
          </button>

          <Link
            href="/products"
            className="flex items-center gap-2 bg-white text-emerald-700 border-2 border-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all"
          >
            <Search className="w-5 h-5" />
            تصفح المنتجات
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
          >
            <Home className="w-5 h-5" />
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
