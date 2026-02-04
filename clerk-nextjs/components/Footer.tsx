"use client";

import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

// تصنيفات البارافارماسيا
const paraCategories = [
  "Visage", "Corps", "Cheveux", "Hygiène", "Bébé & Maman", "Solaire", "Hommes"
];

// تصنيفات الأعشاب والبيو
const herbalCategories = [
  "Huiles Essentielles", "Tisanes & Infusions", "Miel & Ruche", "Compléments Bio", "Cosmétique Bio"
];

const Footer = () => (
  <footer className="bg-gray-800 text-white pt-12 pb-6 mt-12" dir="rtl">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
      <div>
        <h4 className="font-bold text-lg mb-4 text-emerald-400">BioPara.ma</h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          خبيرك في المنتجات شبه الصيدلية والعلاج بالنباتات في المغرب. التحالف المثالي بين العلم والطبيعة.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4">معلومات</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li><Link href="/about" className="hover:text-white">من نحن؟</Link></li>
          <li><Link href="/delivery" className="hover:text-white">التوصيل والإرجاع</Link></li>
          <li><Link href="/terms" className="hover:text-white">الشروط العامة</Link></li>
          <li><Link href="/contact" className="hover:text-white">اتصل بنا</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">أقسامنا</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li className="font-bold text-white mt-2">شبه صيدلية</li>
          {paraCategories.slice(0, 3).map((cat) => (
            <li key={cat}><Link href={`/category/${cat.toLowerCase()}`} className="hover:text-emerald-300 mr-2">- {cat}</Link></li>
          ))}
          <li className="font-bold text-white mt-2">الأعشاب</li>
          {herbalCategories.slice(0, 3).map((cat) => (
            <li key={cat}><Link href={`/category/${cat.toLowerCase()}`} className="hover:text-green-300 mr-2">- {cat}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">النشرة الإخبارية</h4>
        <p className="text-xs text-gray-400 mb-4">اشترك لتلقي عروضنا.</p>
        <div className="flex">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="bg-gray-700 text-white px-3 py-2 text-sm rounded-r w-full focus:outline-none text-right"
          />
          <button className="bg-emerald-600 px-4 py-2 rounded-l text-sm font-bold hover:bg-emerald-700">موافق</button>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Leaf className="w-5 h-5 text-emerald-400" />
      </div>
      © 2026 BioPara. جميع الحقوق محفوظة.
    </div>
  </footer>
);

export default Footer;
