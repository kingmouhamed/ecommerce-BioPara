"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, Shield, Sparkles, Droplets, Baby, User, Sun, Leaf } from 'lucide-react';

const categoryData = [
  {
    href: '/products?category=Visage',
    icon: <Sparkles size={40} />,
    name: 'العناية بالوجه',
    description: 'كريمات، سيرومات، ومنظفات',
  },
  {
    href: '/products?category=Cheveux',
    icon: <Droplets size={40} />,
    name: 'العناية بالشعر',
    description: 'شامبو، بلسم، وزيوت',
  },
  {
    href: '/products?category=Corps',
    icon: <Heart size={40} />,
    name: 'العناية بالجسم',
    description: 'مرطبات، مقشرات، وعناية',
  },
  {
    href: '/products?category=Maman',
    icon: <Baby size={40} />,
    name: 'الأم والطفل',
    description: 'منتجات آمنة للأم والرضيع',
  },
  {
    href: '/products?category=Homme',
    icon: <User size={40} />,
    name: 'عناية الرجل',
    description: 'منتجات حلاقة وعناية بالبشرة',
  },
  {
    href: '/products?category=Hygiène',
    icon: <Shield size={40} />,
    name: 'النظافة الشخصية',
    description: 'منتجات يومية للنظافة',
  },
  {
    href: '/products?category=Solaire',
    icon: <Sun size={40} />,
    name: 'الحماية من الشمس',
    description: 'واقيات شمس لجميع أنواع البشرة',
  },
  {
    href: '/products?category=Bio',
    icon: <Leaf size={40} />,
    name: 'عضوية وطبيعية',
    description: 'مجموعة مختارة من المنتجات الحيوية',
  },
];

const CategoriesGrid = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          استكشف فئاتنا
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoryData.map((category) => (
            <Link href={category.href} key={category.name}>
              <div className="group flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200 text-center transform transition-all duration-300 hover:bg-green-50 hover:shadow-lg hover:-translate-y-2">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-700 mb-4 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;