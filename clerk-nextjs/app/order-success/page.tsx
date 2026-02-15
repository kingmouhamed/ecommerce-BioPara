"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  useEffect(() => {
    // Clear any remaining cart data
    const timer = setTimeout(() => {
      // Additional cleanup if needed
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            تم استلام طلبك بنجاح!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            شكراً لثقتك بنا. سيتم معالجة طلبك وإشعارك بالتفاصيل قريباً.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-right">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">تفاصيل الطلب</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-medium">#{Math.floor(Math.random() * 100000) + 1000}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الطلب:</span>
                <span className="font-medium">{new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-medium">الدفع عند الاستلام</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">التوصيل المتوقع:</span>
                <span className="font-medium">3-5 أيام عمل</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products?category=parapharmacie"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              متابعة التسوق (البارافارماسي)
            </Link>

            <Link
              href="/products?category=medical-herbs"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              متابعة التسوق (الأعشاب الطبية)
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">معلومات مهمة</h3>
            <p className="text-blue-800 text-sm">
              ستصلك رسالة تأكيد على بريدك الإلكتروني تحتوي على تفاصيل الطلب.
              يمكنك أيضاً تتبع حالة طلبك من حسابك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
