"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Star, Package } from 'lucide-react';
import { brands } from '@/data/brands';

export default function Brands() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'العناية بالبشرة', 'العناية بالطفل', 'الأعشاب الطبية', 'التجميل الطبيعي', 'مضادات الشيخوخة', 'منتجات طبيعية'];

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBrands = brands.filter(brand => brand.featured);
  const regularBrands = filteredBrands.filter(brand => !brand.featured);

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
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 p-3">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<span class="text-3xl">🏷️</span>';
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{brand.name}</h3>
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
          )}
        </div>
      </div>
    </div>
  );
}
