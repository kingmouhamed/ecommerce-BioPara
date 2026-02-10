"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const brands = [
    {
      id: 1,
      name: "La Roche-Posay",
      logo: "🧴",
      description: "رعاية البشرة الحساسة",
      productCount: 45,
      category: "العناية بالبشرة"
    },
    {
      id: 2,
      name: "Vichy",
      logo: "💧",
      description: "منتجات العناية بالبشرة المعدنية",
      productCount: 38,
      category: "العناية بالبشرة"
    },
    {
      id: 3,
      name: "CeraVe",
      logo: "🌿",
      description: "عناية بالبشرة بالسيراميد",
      productCount: 32,
      category: "العناية بالبشرة"
    },
    {
      id: 4,
      name: "Bioderma",
      logo: "🌸",
      description: "رعاية البشرة الحساسة",
      productCount: 28,
      category: "العناية بالبشرة"
    },
    {
      id: 5,
      name: "Avène",
      logo: "🌺",
      description: "علاج البشرة بالينابيع الحرارية",
      productCount: 35,
      category: "العناية بالبشرة"
    },
    {
      id: 6,
      name: "Nuxe",
      logo: "🌻",
      description: "منتجات تجميل طبيعية",
      productCount: 42,
      category: "العناية بالبشرة"
    },
    {
      id: 7,
      name: "Uriage",
      logo: "⛰️",
      description: "عناية بالبشرة بالمياه الحرارية",
      productCount: 25,
      category: "العناية بالبشرة"
    },
    {
      id: 8,
      name: "Mustela",
      logo: "👶",
      description: "العناية بالأم والطفل",
      productCount: 18,
      category: "العناية بالطفل"
    },
    {
      id: 9,
      name: "Eucerin",
      logo: "🧼",
      description: "حلول العناية بالبشرة المتقدمة",
      productCount: 40,
      category: "العناية بالبشرة"
    },
    {
      id: 10,
      name: "SVR",
      logo: "🔬",
      description: "علاجات جلدية متخصصة",
      productCount: 22,
      category: "العناية بالبشرة"
    },
    {
      id: 11,
      name: "Filorga",
      logo: "✨",
      description: "مستحضرات مضادة للشيخوخة",
      productCount: 30,
      category: "العناية بالبشرة"
    },
    {
      id: 12,
      name: "BioOriental",
      logo: "🌿",
      description: "زيوت وأعشاب طبيعية",
      productCount: 48,
      category: "الأعشاب الطبية"
    }
  ];

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">ماركاتنا الموثوقة</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الماركات العالمية والمحلية في مجال الصيدلة والأعشاب الطبية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن ماركة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{brand.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{brand.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-600 font-medium">{brand.productCount} منتج</span>
                  <span className="text-gray-500">{brand.category}</span>
                </div>
                <button className="mt-4 w-full bg-emerald-700 text-white py-2 rounded-lg font-medium hover:bg-emerald-800 transition">
                  عرض المنتجات
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لم يتم العثور على ماركات</h3>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </div>
  );
}
