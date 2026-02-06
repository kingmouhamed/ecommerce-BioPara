"use client";

import React from "react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">الشروط العامة</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-4">شروط الاستخدام</h2>
          <p className="text-gray-700 mb-6">
            مرحباً بك في BioPara.ma. باستخدام موقعنا، أنت توافق على الشروط التالية:
          </p>
          
          <h3 className="text-xl font-semibold mb-3">1. المنتجات والأسعار</h3>
          <p className="text-gray-700 mb-4">
            جميع المنتجات معروضة بأسعارها شاملة الضريبة. نحتفظ بالحق في تغيير الأسعار في أي وقت.
          </p>
          
          <h3 className="text-xl font-semibold mb-3">2. الطلبات والدفع</h3>
          <p className="text-gray-700 mb-4">
            يتم تأكيد الطلبات بعد استلام الدفع. نقبل مختلف وسائل الدفع المتاحة في المغرب.
          </p>
          
          <h3 className="text-xl font-semibold mb-3">3. الشحن والتوصيل</h3>
          <p className="text-gray-700 mb-4">
            نقوم بالتوصيل في جميع أنحاء المغرب خلال 3-5 أيام عمل.
          </p>
          
          <h3 className="text-xl font-semibold mb-3">4. الإرجاع والاستبدال</h3>
          <p className="text-gray-700 mb-4">
            يمكن إرجاع المنتجات خلال 7 أيام من استلامها في حال كانت سليمة وغير مستخدمة.
          </p>
          
          <h3 className="text-xl font-semibold mb-3">5. الخصوصية</h3>
          <p className="text-gray-700 mb-4">
            نحن نحترم خصوصيتك ولا نشارك معلوماتك مع أطراف ثالثة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
