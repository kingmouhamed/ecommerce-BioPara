"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Star, Package } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  productCount: number;
  rating: number;
  category: string;
  featured?: boolean;
}

const brands: Brand[] = [
  {
    id: 1,
    name: "La Roche-Posay",
    logo: "/images/brands/la-roche-posay-logo.png",
    description: "رعاية البشرة الحساسة",
    productCount: 45,
    rating: 4.8,
    category: "العناية بالبشرة",
    featured: true
  },
  {
    id: 2,
    name: "Vichy",
    logo: "/images/brands/vichy-logo.png",
    description: "منتجات العناية بالبشرة المعدنية",
    productCount: 38,
    rating: 4.7,
    category: "العناية بالبشرة",
    featured: true
  },
  {
    id: 3,
    name: "CeraVe",
    logo: "/images/brands/cerave-logo.png",
    description: "عناية بالبشرة بالسيراميد",
    productCount: 32,
    rating: 4.6,
    category: "العناية بالبشرة"
  },
  {
    id: 4,
    name: "Bioderma",
    logo: "/images/brands/bioderma-logo.png",
    description: "رعاية البشرة الحساسة",
    productCount: 28,
    rating: 4.7,
    category: "العناية بالبشرة"
  },
  {
    id: 5,
    name: "Avène",
    logo: "/images/brands/avene-logo.png",
    description: "علاج البشرة بالينابيع الحرارية",
    productCount: 35,
    rating: 4.8,
    category: "العناية بالبشرة"
  },
  {
    id: 6,
    name: "Nuxe",
    logo: "/images/brands/nuxe-logo.png",
    description: "منتجات تجميل طبيعية",
    productCount: 42,
    rating: 4.5,
    category: "العناية بالبشرة"
  },
  {
    id: 7,
    name: "Uriage",
    logo: "/images/brands/uriage-logo.png",
    description: "عناية بالبشرة بالمياه الحرارية",
    productCount: 25,
    rating: 4.6,
    category: "العناية بالبشرة"
  },
  {
    id: 8,
    name: "Mustela",
    logo: "/images/brands/mustela-logo.png",
    description: "العناية بالأم والطفل",
    productCount: 18,
    rating: 4.9,
    category: "العناية بالطفل"
  },
  {
    id: 9,
    name: "Eucerin",
    logo: "/images/brands/eucerin-logo.png",
    description: "حلول العناية بالبشرة المتقدمة",
    productCount: 40,
    rating: 4.7,
    category: "العناية بالبشرة"
  },
  {
    id: 10,
    name: "SVR",
    logo: "/images/brands/svr-logo.png",
    description: "علاجات جلدية متخصصة",
    productCount: 22,
    rating: 4.6,
    category: "العناية بالبشرة"
  },
  {
    id: 11,
    name: "Filorga",
    logo: "/images/brands/filorga-logo.png",
    description: "مستحضرات مضادة للشيخوخة",
    productCount: 30,
    rating: 4.8,
    category: "العناية بالبشرة"
  },
  {
    id: 12,
    name: "BioOriental",
    logo: "/images/brands/bio-oriental-logo.png",
    description: "زيوت وأعشاب طبيعية",
    productCount: 48,
    rating: 4.9,
    category: "الأعشاب الطبية",
    featured: true
  }
];

export default function Brands() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'العناية بالبشرة', 'العناية بالطفل', 'الأعشاب الطبية'];

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBrands = brands.filter(brand => brand.featured);
  const regularBrands = filteredBrands.filter(brand => !brand.featured);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
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
        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن ماركة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'جميع الفئات' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Brands */}
        {searchTerm === '' && selectedCategory === 'all' && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">الماركات المميزة</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 p-3">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<span class="text-4xl">🏷️</span>';
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">{brand.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{brand.description}</p>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-emerald-600 font-medium">{brand.productCount} منتج</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{brand.rating}</span>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors text-sm">
                      استكشف المنتجات →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Brands */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            {searchTerm || selectedCategory !== 'all' ? 'نتائج البحث' : 'جميع الماركات'}
          </h2>
          
          {filteredBrands.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لم يتم العثور على ماركات</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تغيير الفئة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform p-3">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<span class="text-4xl">🏷️</span>';
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">{brand.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{brand.description}</p>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {brand.productCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{brand.rating}</span>
                      </div>
                    </div>
                    <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                      عرض المنتجات
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
