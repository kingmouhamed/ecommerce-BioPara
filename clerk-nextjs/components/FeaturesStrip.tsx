"use client";

import React from 'react';
import { Truck, Shield, Headphones, Award } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: 'توصيل سريع',
    description: 'لجميع أنحاء المغرب خلال 24-48 ساعة'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'منتجات أصلية',
    description: 'ضمان 100% على جميع المنتجات'
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: 'دعم فني',
    description: 'فريق متخصص جاهز لمساعدتك'
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'جودة عالية',
    description: 'أفضل الماركات العالمية والمحلية'
  }
];

export default function FeaturesStrip() {
  return (
    <div className="bg-emerald-700 text-white py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
