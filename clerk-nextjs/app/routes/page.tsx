"use client";

import React from "react";

const SitemapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">خريطة الموقع</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">صفحات الموقع</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">الصفحات الرئيسية</h3>
              <ul className="space-y-2 text-gray-700">
                <li><a href="/" className="text-blue-600 hover:underline">الرئيسية</a></li>
                <li><a href="/products" className="text-blue-600 hover:underline">جميع المنتجات</a></li>
                <li><a href="/promotions" className="text-blue-600 hover:underline">العروض</a></li>
                <li><a href="/about" className="text-blue-600 hover:underline">من نحن</a></li>
                <li><a href="/contact" className="text-blue-600 hover:underline">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">التصنيفات</h3>
              <ul className="space-y-2 text-gray-700">
                <li><a href="/products?category=شبه صيدلية" className="text-blue-600 hover:underline">شبه صيدلية</a></li>
                <li><a href="/products?category=الأعشاب الطبية" className="text-blue-600 hover:underline">الأعشاب الطبية</a></li>
                <li><a href="/category/العناية بالوجه" className="text-blue-600 hover:underline">العناية بالوجه</a></li>
                <li><a href="/category/العناية بالجسم" className="text-blue-600 hover:underline">العناية بالجسم</a></li>
                <li><a href="/category/العناية بالشعر" className="text-blue-600 hover:underline">العناية بالشعر</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">حساب المستخدم</h3>
              <ul className="space-y-2 text-gray-700">
                <li><a href="/auth/login" className="text-blue-600 hover:underline">تسجيل الدخول</a></li>
                <li><a href="/auth/signup" className="text-blue-600 hover:underline">إنشاء حساب</a></li>
                <li><a href="/dashboard/favorites" className="text-blue-600 hover:underline">المفضلة</a></li>
                <li><a href="/dashboard/addresses" className="text-blue-600 hover:underline">العناوين</a></li>
                <li><a href="/cart" className="text-blue-600 hover:underline">السلة</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">معلومات إضافية</h3>
              <ul className="space-y-2 text-gray-700">
                <li><a href="/delivery" className="text-blue-600 hover:underline">التوصيل والإرجاع</a></li>
                <li><a href="/payment" className="text-blue-600 hover:underline">طرق الدفع</a></li>
                <li><a href="/auth/terms" className="text-blue-600 hover:underline">الشروط العامة</a></li>
                <li><a href="/brands" className="text-blue-600 hover:underline">الماركات</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
