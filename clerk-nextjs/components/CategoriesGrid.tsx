"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield, Truck } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const categories: Category[] = [
  {
    id: 'medical-herbs',
    name: 'الأعشاب الطبية',
    description: 'مستحضرات طبيعية للعلاج والوقاية',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'bg-emerald-100 text-emerald-700',
    href: '/products?category=medical-herbs'
  },
  {
    id: 'parapharmacie',
    name: 'Parapharmacie',
    description: 'منتجات العناية بالبشرة والشعر',
    icon: <Heart className="w-8 h-8" />,
    color: 'bg-pink-100 text-pink-700',
    href: '/products?category=parapharmacie'
  },
  {
    id: 'vitamins',
    name: 'الفيتامينات والمكملات',
    description: 'دعم صحي ومناعة قوية',
    icon: <Shield className="w-8 h-8" />,
    color: 'bg-blue-100 text-blue-700',
    href: '/products?category=vitamins'
  },
  {
    id: 'organic',
    name: 'منتجات عضوية',
    description: 'طبيعية 100% وخالية من المواد الكيميائية',
    icon: <Truck className="w-8 h-8" />,
    color: 'bg-green-100 text-green-700',
    href: '/products?category=organic'
  }
];

export default function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.href}
          className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-emerald-200"
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
              {category.icon}
            </div>
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {category.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
