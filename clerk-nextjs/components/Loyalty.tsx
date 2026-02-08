"use client";

import React from 'react';
import { Gift, Star, Crown, Zap } from 'lucide-react';

interface LoyaltyTier {
  name: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  minSpent: number;
}

const tiers: LoyaltyTier[] = [
  {
    name: 'عضو برونزي',
    icon: <Gift className="w-6 h-6" />,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    benefits: ['نقاط على كل مشترى', 'عروض حصرية', 'توصيل مجاني فوق 300 درهم'],
    minSpent: 0
  },
  {
    name: 'عضو فضي',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    benefits: ['جميع مزايا البرونزي', 'خصم إضافي 5%', 'هدايا عيد الميلاد'],
    minSpent: 2000
  },
  {
    name: 'عضو ذهبي',
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    benefits: ['جميع مزايا الفضي', 'خصم إضافي 10%', 'دعم مخصص', 'وصول مبكر للعروض'],
    minSpent: 5000
  },
  {
    name: 'عضو بلاتيني',
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    benefits: ['جميع مزايا الذهبي', 'خصم إضافي 15%', 'توصيل مجاني دائماً', 'منتجات حصرية'],
    minSpent: 10000
  }
];

export default function Loyalty() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            برنامج ولاء BioPara
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            انضم إلى برنامج الولاء واستمتع بمزايا حصرية وعروض خاصة على جميع منتجاتنا
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl p-6 border-2 ${tier.color} hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {index === 3 && (
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  الأفضل
                </div>
              )}
              
              <div className="flex flex-col items-center text-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${tier.color}`}>
                  {tier.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                <p className="text-sm text-gray-600">بعد إنفاق {tier.minSpent} درهم</p>
              </div>

              <ul className="space-y-2 text-sm">
                {tier.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ابدأ رحلتك مع BioPara اليوم
            </h3>
            <p className="text-gray-600 mb-6">
              سجل الآن واحصل على 100 نقطة ولاء مجاناً + خصم 10% على أول طلب
            </p>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              سجل الآن واحصل على مزايا
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">50,000+</div>
            <div className="text-gray-600">عضو نشط</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">2M+</div>
            <div className="text-gray-600">نقطة ولاء ممنوحة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
            <div className="text-gray-600">معدل الرضا</div>
          </div>
        </div>
      </div>
    </div>
  );
}
