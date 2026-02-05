"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="mb-8">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">جاري التحميل...</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          يرجى الانتظار بينما نقوم بتحميل المحتوى
        </p>

        {/* Skeleton Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              {/* Product Image Skeleton */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              
              {/* Product Info Skeleton */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
