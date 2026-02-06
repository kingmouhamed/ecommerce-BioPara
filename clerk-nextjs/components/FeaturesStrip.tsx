
"use client";

import React from "react";
import { Truck, ShieldCheck, CreditCard, Star } from "lucide-react";

const FeaturesStrip = () => (
  <div className="bg-white border-b py-6">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-center divide-x divide-gray-100">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <Truck />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">توصيل سريع</h4>
        <p className="text-xs text-gray-500">لكل أنحاء المغرب خلال 24/48 ساعة</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <ShieldCheck />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">منتجات أصلية</h4>
        <p className="text-xs text-gray-500">مضمونة 100% من مختبراتنا</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <CreditCard />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">دفع آمن</h4>
        <p className="text-xs text-gray-500">بطاقة بنكية أو عند الاستلام</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <Star />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">خدمة العملاء</h4>
        <p className="text-xs text-gray-500">متاحة 7 أيام في الأسبوع</p>
      </div>
    </div>
  </div>
);

export default FeaturesStrip;
