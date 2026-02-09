"use client";

import React from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
}

const categories: Category[] = [
  {
    id: 'medical-herbs',
    name: 'الأعشاب الطبية',
    description: 'مستحضرات طبيعية للعلاج والوقاية',
    image: '/images/categories/medical-herbs.jpg',
    href: '/products?category=medical-herbs'
  },
  {
    id: 'parapharmacie',
    name: 'Parapharmacie',
    description: 'منتجات العناية بالبشرة والشعر',
    image: '/images/categories/parapharmacie.jpg',
    href: '/products?category=parapharmacie'
  },
  {
    id: 'natural-oils',
    name: 'الزيوت الطبيعية',
    description: 'زيوت أساسية وعطرية للعناية',
    image: '/images/categories/natural-oils.jpg',
    href: '/products?category=natural-oils'
  },
  {
    id: 'skincare',
    name: 'العناية بالبشرة',
    description: 'منتجات طبيعية للعناية بالبشرة',
    image: '/images/categories/skincare.jpg',
    href: '/products?category=skincare'
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
            <div className="w-full h-32 rounded-lg overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-4xl">📷</span></div>';
                  }
                }}
              />
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
