"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Droplets, Leaf } from "lucide-react";

// تصنيفات البارافارماسيا
const paraCategories = [
  "العناية بالوجه", "العناية بالجسم", "العناية بالشعر", "النظافة الشخصية", "الأم والطفل", "الحماية من الشمس", "رجال"
];

// تصنيفات الأعشاب والبيو
const herbalCategories = [
  "الزيوت العطرية", "الأعشاب والمشروبات", "العسل ومنتجات النحل", "المكملات الغذائية", "مستحضرات التجميل العضوية"
];

const Hero = () => (
  <div className="bg-gray-100 py-8" dir="rtl">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Sidebar Menu */}
      <div className="hidden md:block col-span-1 bg-white rounded-md shadow-sm p-4 h-full">
        
        {/* Parapharmacie Section */}
        <div className="mb-6">
            <h3 className="font-bold text-emerald-800 mb-3 border-b pb-2 flex items-center gap-2">
                <Droplets size={16}/> شبه صيدلية
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
            {paraCategories.map((cat) => (
                <li key={cat}>
                <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="flex justify-between items-center hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded transition"
                >
                    <span>{cat}</span> <ChevronRight size={14} />
                </Link>
                </li>
            ))}
            </ul>
        </div>

        {/* Herboristerie Section */}
        <div>
            <h3 className="font-bold text-green-700 mb-3 border-b pb-2 flex items-center gap-2">
                <Leaf size={16}/> الأعشاب والمنتجات الطبيعية
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
            {herbalCategories.map((cat) => (
                <li key={cat}>
                <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="flex justify-between items-center hover:text-green-700 hover:bg-green-50 p-2 rounded transition"
                >
                    <span>{cat}</span> <ChevronRight size={14} />
                </Link>
                </li>
            ))}
            </ul>
        </div>

      </div>

      {/* Main Banner */}
      <div className="col-span-1 md:col-span-3 bg-emerald-100 rounded-xl overflow-hidden relative min-h-[300px] md:min-h-[400px] flex items-center justify-center text-center p-6 cursor-pointer group">
        <Image
          src="/Hero.png"
          alt="BioPara Hero Banner"
          fill
          className="object-cover opacity-90 group-hover:scale-105 transition duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 75vw"
          priority
        />
        <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-lg border-l-4 border-emerald-600">
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">جديد</span>
          <h2 className="text-3xl md:text-5xl font-bold text-emerald-800 mb-2">الطبيعة والعلم</h2>
          <p className="text-gray-700 mb-6 text-lg">اكتشف أكثر من 300 منتج أصلي لرفاهيتك</p>
          <div className="flex gap-4 justify-center">
             <Link href="/products?category=Parapharmacie">
                <button className="bg-emerald-700 text-white px-6 py-2 rounded font-medium hover:bg-emerald-800 transition shadow-lg">
                   منتجات شبه صيدلية
               </button>
             </Link>
             <Link href="/products?category=الأعشاب الطبية">
                <button className="bg-white text-emerald-700 border border-emerald-700 px-6 py-2 rounded font-medium hover:bg-emerald-50 transition shadow-lg">
                   منتجات طبيعية
               </button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
