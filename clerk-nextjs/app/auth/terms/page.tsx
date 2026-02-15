"use client";

import React from "react";
import Link from "next/link";
import { FileText, Shield, Truck, CreditCard, HelpCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="bg-white border-b py-12">
         <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">الشروط العامة</h1>
            <p className="text-gray-500">آخر تحديث: 01 فبراير 2026</p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Sidebar Navigation (Sticky) */}
            <div className="md:col-span-4 lg:col-span-3">
               <div className="sticky top-24 space-y-2">
                  <a href="#article1" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-emerald-100 text-emerald-700 font-medium hover:bg-emerald-50 transition">
                     <FileText size={18}/> الغرض
                  </a>
                  <a href="#article2" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <Shield size={18}/> المنتجات
                  </a>
                  <a href="#article3" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <CreditCard size={18}/> الأسعار والدفع
                  </a>
                  <a href="#article4" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <Truck size={18}/> التوصيل
                  </a>
                  <a href="#contact" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <HelpCircle size={18}/> التواصل
                  </a>
               </div>
            </div>

            {/* Content */}
            <div className="md:col-span-8 lg:col-span-9 space-y-12">
               
               <section id="article1" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">المادة 1: الغرض</h2>
                  <p className="text-gray-600 leading-relaxed">
                     تنظم هذه الشروط المبيعات التي تقوم بها شركة <strong>BioPara المغرب</strong> للمنتجات شبه الصيدلية ومستحضرات التجميل. تطبق هذه الشروط حصرياً على أي شروط أخرى، ولا سيما تلك المعمول بها للمبيعات في المتجر.
                  </p>
               </section>

               <section id="article2" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">المادة 2: المنتجات</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                     المنتجات المعروضة هي تلك الموجودة في الكتالوج المنشور على الموقع، ضمن حدود المخزون المتاح. يرافق كل منتج وصف أنشأه المورد.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 text-sm text-yellow-800">
                     <strong>ملاحظة:</strong> صور الكتالوج هي الأكثر دقة ممكنة ولكن لا يمكنها ضمان تطابق مثالي مع المنتج المقدم.
                  </div>
               </section>

               <section id="article3" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">المادة 3: الأسعار والدفع</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                     الأسعار معروضة بالدرهم المغربي (DH) شاملة جميع الضرائب (شامل الضريبة). تحتفظ BioPara بالحق في تعديل أسعارها في أي وقت.
                  </p>
                  <ul className="list-disc pr-5 space-y-2 text-gray-600">
                     <li>الدفع مستحق فوراً عند الطلب (بطاقة بنكية).</li>
                     <li>أو عند التسليم (الدفع عند الاستلام).</li>
                  </ul>
               </section>

               <section id="article4" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">المادة 4: التوصيل</h2>
                  <p className="text-gray-600 leading-relaxed">
                     تتم التوصيلات إلى العنوان المشار إليه في أمر الشراء. تكون المخاطر على عاتق المشتري من لحظة مغادرة المنتجات لمقرات BioPara. في حالة حدوث ضرر أثناء النقل، يجب تقديم احتجاج موجه إلى الناقل في غضون ثلاثة أيام من التسليم.
                  </p>
               </section>

               <section id="contact" className="bg-emerald-50 p-8 rounded-xl border border-emerald-100 text-center">
                  <h3 className="font-bold text-emerald-800 mb-2">لديك أسئلة حول شروطنا؟</h3>
                  <p className="text-emerald-700 mb-6 text-sm">فريقنا القانوني في خدمتك.</p>
                  <Link href="/contact" className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-800 transition">
                     تواصل معنا
                  </Link>
               </section>

            </div>
         </div>
      </div>
    </div>
  );
}