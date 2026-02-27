"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تصفح فئاتنا
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعتنا المختارة بعناية من المنتجات الطبيعية والعلاجات الصحية
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Category Image */}
              <div className="relative h-80 w-full">
                <Image
                  src={category.image}
                  alt={category.nameAr}
                  width={400}
                  height={320}
                  className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {/* Icon */}
                  <div className="text-3xl mb-3">{category.icon}</div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-2">{category.nameAr}</h3>
                  
                  {/* Description */}
                  <p className="text-sm text-white/90 mb-4 line-clamp-2">
                    {category.descriptionAr}
                  </p>
                  
                  {/* Product Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/75">
                      {category.productCount} منتج
                    </span>
                    
                    {/* Explore Button */}
                    <div className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                      استكشف
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-600 rounded-full"></div>
              <span>منتجات طبيعية 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-600 rounded-full"></div>
              <span>جودة معتمدة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-600 rounded-full"></div>
              <span>شحن سريع</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
