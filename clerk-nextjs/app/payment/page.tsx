"use client";

import React from "react";
import { CreditCard, Shield, Lock, Smartphone, Wallet } from "lucide-react";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">طرق الدفع</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نقدم لك طرق دفع آمنة ومتنوعة لراحتك
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Payment Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">طرق الدفع المتاحة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-emerald-600">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8 text-emerald-700" />
                <h3 className="text-xl font-bold text-gray-800">البطاقة البنكية</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  ادفع بأمان باستخدام بطاقتك الائتمانية أو الخصم المباشر
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">Visa</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">Mastercard</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">CIH</span>
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  فوري وآمن 100%
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="w-8 h-8 text-blue-700" />
                <h3 className="text-xl font-bold text-gray-800">الدفع عبر الهاتف</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  استخدم تطبيقات الدفع عبر الهاتف المحمول
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">Orange Money</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">IAM Cash</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">Inwi Money</span>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  سريع ومريح
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-purple-700" />
                <h3 className="text-xl font-bold text-gray-800">الدفع عند الاستلام</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  ادفع نقداً عند استلام طلبك
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">نقداً</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">آمن</span>
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  بدون رسوم إضافية
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">الأمان والخصوصية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تشفير SSL</h3>
              <p className="text-gray-600 text-sm">
                جميع المعاملات مشفرة بتقنية SSL المتقدمة
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">حماية البيانات</h3>
              <p className="text-gray-600 text-sm">
                لا نشارك معلوماتك مع أي طرف ثالث
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">معايير PCI</h3>
              <p className="text-gray-600 text-sm">
                نلتزم بمعايير الأمان العالمية للبطاقات
              </p>
            </div>
          </div>
        </div>

        {/* Payment Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">كيفية الدفع</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h3 className="font-bold text-gray-800 mb-2">اختر المنتجات</h3>
                <p className="text-gray-600 text-sm">
                  أضف المنتجات إلى سلة التسوق
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h3 className="font-bold text-gray-800 mb-2">أكمل البيانات</h3>
                <p className="text-gray-600 text-sm">
                  أدخل معلومات الشحن والدفع
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-bold text-gray-800 mb-2">اختر طريقة الدفع</h3>
                <p className="text-gray-600 text-sm">
                  اختر الطريقة المناسبة لك
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  4
                </div>
                <h3 className="font-bold text-gray-800 mb-2">تأكيد الطلب</h3>
                <p className="text-gray-600 text-sm">
                  استلم تأكيد الطلب فوراً
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">أسئلة شائعة عن الدفع</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">هل الدفع آمن؟</h4>
              <p className="text-emerald-700 text-sm">
                نعم، نستخدم أحدث تقنيات التشفير وحماية البيانات لضمان أمان جميع المعاملات.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">متى يتم خصم المبلغ؟</h4>
              <p className="text-emerald-700 text-sm">
                يتم خصم المبلغ فوراً عند تأكيد الطلب للدفع عبر البطاقة، أو عند الاستلام للدفع النقدي.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">هل يمكن إلغاء الدفع؟</h4>
              <p className="text-emerald-700 text-sm">
                يمكن إلغاء الطلب قبل الشحن واسترداد المبلغ خلال 3-5 أيام عمل.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">هل هناك رسوم دفع؟</h4>
              <p className="text-emerald-700 text-sm">
                لا، لا توجد أي رسوم إضافية على عمليات الدفع.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
