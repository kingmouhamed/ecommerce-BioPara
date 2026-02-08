"use client";

import React, { useState } from 'react';
import { Star, TrendingUp, Clock, Award } from 'lucide-react';
import { allProducts } from '../data/index';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  badge?: string;
}

const tabs: Tab[] = [
  { id: 'new', label: 'وصل حديثاً', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'selling', label: 'الأكثر مبيعاً', icon: <Award className="w-4 h-4" /> },
  { id: 'offers', label: 'عروض خاصة', icon: <Clock className="w-4 h-4" /> },
  { id: 'rated', label: 'الأعلى تقييماً', icon: <Star className="w-4 h-4" /> }
];

// Filter products based on active tab
const getFilteredProducts = (tabId: string) => {
  switch (tabId) {
    case 'new':
      return allProducts.filter(p => p.isNew).slice(0, 8);
    case 'selling':
      return allProducts.filter(p => p.badge === 'الأكثر مبيعاً').slice(0, 8);
    case 'offers':
      return allProducts.filter(p => p.originalPrice).slice(0, 8);
    case 'rated':
      return allProducts.sort((a, b) => b.rating - a.rating).slice(0, 8);
    default:
      return allProducts.slice(0, 8);
  }
};

export default function FeaturedTabs() {
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" dir="rtl">
      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium rounded-t-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getFilteredProducts(activeTab).map((product) => (
          <div key={product.id} className="group">
            <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-3">
              {product.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                  {product.badge}
                </span>
              )}
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
              {product.title}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-600">{product.price} درهم</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{product.originalPrice} درهم</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
          عرض جميع المنتجات
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
