"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, MessageCircle, Phone, ChevronLeft } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
              <HelpCircle className="w-4 h-4" />
              مركز المساعدة
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">كيف يمكننا مساعدتك؟</h1>
            <p className="text-gray-600 mt-3">
              هنا ستجد إجابات سريعة وروابط مفيدة. إذا احتجت دعمًا مباشرًا تواصل معنا عبر واتساب.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/faq"
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
            >
              <div className="font-bold text-gray-900">الأسئلة الشائعة</div>
              <div className="text-sm text-gray-600 mt-1">أجوبة لأكثر الأسئلة تكرارًا.</div>
            </Link>

            <Link
              href="/delivery"
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
            >
              <div className="font-bold text-gray-900">التوصيل</div>
              <div className="text-sm text-gray-600 mt-1">معلومات الشحن والمدة والمدن.</div>
            </Link>

            <Link
              href="/payment"
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
            >
              <div className="font-bold text-gray-900">طرق الدفع</div>
              <div className="text-sm text-gray-600 mt-1">شرح طريقة الدفع عبر واتساب.</div>
            </Link>

            <Link
              href="/contact"
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
            >
              <div className="font-bold text-gray-900">اتصل بنا</div>
              <div className="text-sm text-gray-600 mt-1">دعم سريع ومباشر.</div>
            </Link>
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">تواصل سريع</h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+212673020264"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-5 py-3 rounded-2xl transition-colors"
              >
                <Phone className="w-5 h-5" />
                +212 673020264
              </a>
              <a
                href="https://wa.me/212673020264"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-2xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold px-5 py-3 rounded-2xl transition-colors"
              >
                العودة للرئيسية
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
