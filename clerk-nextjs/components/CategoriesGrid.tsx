"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Leaf, Sparkles } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    id: 'medical-herbs',
    name: 'الأعشاب الطبية',
    description: 'مستحضرات طبيعية للعلاج والوقاية',
    image: '/images/categories/medical-herbs.jpg',
    href: '/products?category=medical-herbs',
    icon: <Leaf className="w-8 h-8" />
  },
  {
    id: 'parapharmacie',
    name: 'البارافارماسي',
    description: 'منتجات العناية بالبشرة والشعر',
    image: '/images/categories/parapharmacie.jpg',
    href: '/products?category=parapharmacie',
    icon: <Sparkles className="w-8 h-8" />
  }
];

export default function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.href}
          className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-300 overflow-hidden transform hover:scale-105"
        >
          <div className="relative w-full h-56 bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/backgrounds/pattern.svg')] opacity-10"></div>
            <Image 
              src={category.image} 
              alt={category.name} 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
                      <div class="text-emerald-600 mb-4">
                        ${category.id === 'medical-herbs' ? '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
                      </div>
                      <div class="text-emerald-700 font-bold text-lg">${category.name}</div>
                    </div>
                  `;
                }
              }}
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg group-hover:bg-white transition-all">
              {category.icon}
            </div>
          </div>
          <div className="p-8 text-center">
            <h3 className="font-bold text-2xl text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {category.description}
            </p>
            <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold bg-emerald-50 px-4 py-2 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all">
              تسوق الآن
              <ChevronLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
