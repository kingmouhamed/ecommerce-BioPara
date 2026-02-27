"use client";

import React from "react";
import { MessageCircle, Phone, Shield, Lock } from "lucide-react";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">الدفع عبر واتساب</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اجعل عملية الدفع أسهل: تواصل معنا عبر واتساب لإتمام الدفع وتأكيد طلبك
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Payment Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">طريقة الدفع المتاحة</h2>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">الدفع عبر واتساب فقط</h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    تواصل معنا عبر واتساب لإرسال تفاصيل طلبك، وسنزوّدك بخطوات الدفع وتأكيد الطلب.
                  </p>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://wa.me/212600000000"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      افتح واتساب للدفع
                    </a>
                    <a
                      href="tel:+212600000000"
                      className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      <Phone className="w-5 h-5 text-emerald-700" />
                      اتصل بنا
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <div className="text-sm font-semibold text-emerald-800 mb-2">رقم واتساب</div>
                <div className="text-lg font-extrabold text-gray-900" dir="ltr">
                  +212 673020264
                </div>
                <div className="text-sm text-gray-600 mt-2">الرد عادة خلال دقائق في أوقات العمل</div>
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
                <Shield className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تأكيد عبر واتساب</h3>
              <p className="text-gray-600 text-sm">
                يتم تأكيد الدفع والطلب مباشرة عبر محادثة واتساب
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
                <h3 className="font-bold text-gray-800 mb-2">أرسل تفاصيلك</h3>
                <p className="text-gray-600 text-sm">
                  أرسل اسمك وعنوانك ورقم الطلب
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-bold text-gray-800 mb-2">ادفع عبر واتساب</h3>
                <p className="text-gray-600 text-sm">
                  سنزوّدك بالخطوات المناسبة للدفع
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
                يتم الاتفاق على خطوات الدفع وتأكيدها عبر واتساب قبل تجهيز الطلب للشحن.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">هل يمكن إلغاء الدفع؟</h4>
              <p className="text-emerald-700 text-sm">
                يمكنك إلغاء الطلب قبل الشحن من خلال مراسلتنا على واتساب.
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
