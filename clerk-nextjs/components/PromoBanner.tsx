"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, Tag, Gift } from 'lucide-react';

interface PromoBannerProps {
  type?: 'sale' | 'new' | 'shipping' | 'loyalty';
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const promoTypes = {
  sale: {
    icon: <Tag className="w-6 h-6" />,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    defaultTitle: 'عروض حصرية',
    defaultDescription: 'خصم يصل إلى 50% على المنتجات المختارة',
    defaultButtonText: 'تسوق الآن',
    defaultButtonLink: '/promotions'
  },
  new: {
    icon: <Sparkles className="w-6 h-6" />,
    bgColor: 'bg-emerald-600',
    textColor: 'text-white',
    defaultTitle: 'وصل حديثاً',
    defaultDescription: 'اكتشف أحدث المنتجات والماركات',
    defaultButtonText: 'استكشف',
    defaultButtonLink: '/products?filter=new'
  },
  shipping: {
    icon: <Clock className="w-6 h-6" />,
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    defaultTitle: 'توصيل مجاني',
    defaultDescription: 'للطلبات فوق 300 درهم في جميع أنحاء المغرب',
    defaultButtonText: 'اعرف المزيد',
    defaultButtonLink: '/delivery'
  },
  loyalty: {
    icon: <Gift className="w-6 h-6" />,
    bgColor: 'bg-purple-600',
    textColor: 'text-white',
    defaultTitle: 'برنامج الولاء',
    defaultDescription: 'انضم الآن واحصل على 100 نقطة مجاناً',
    defaultButtonText: 'سجل الآن',
    defaultButtonLink: '/loyalty'
  }
};

export default function PromoBanner({
  type = 'sale',
  title,
  description,
  buttonText,
  buttonLink,
  bgColor,
  textColor,
  className = ''
}: PromoBannerProps) {
  const config = promoTypes[type];
  
  return (
    <div className={`${bgColor || config.bgColor} ${textColor || config.textColor} py-12 px-4 ${className}`} dir="rtl">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Content */}
          <div className="flex-1 text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {config.icon}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                {title || config.defaultTitle}
              </h2>
            </div>
            
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto lg:mx-0">
              {description || config.defaultDescription}
            </p>
            
            <Link
              href={buttonLink || config.defaultButtonLink}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              {buttonText || config.defaultButtonText}
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/20 rounded-full flex items-center justify-center">
                <div className="text-6xl lg:text-8xl font-bold opacity-50">
                  {type === 'sale' && '%'}
                  {type === 'new' && '🆕'}
                  {type === 'shipping' && '🚚'}
                  {type === 'loyalty' && '🎁'}
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-75"></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
