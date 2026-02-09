"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, Sparkles, ArrowLeft } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-cover bg-center bg-no-repeat py-16 sm:py-20 lg:py-32" style={{ backgroundImage: 'url("/Hero-new.png")' }} dir="rtl">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-teal-900/30"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-white/40">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              منتجات طبيعية 100% من مصادر موثوقة
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
              اكتشف عالم
              <span className="text-emerald-300 drop-shadow-lg"> الطبيعة</span>
              <br />
              والعلاج بالأعشاب
            </h1>
            
            <p className="text-base sm:text-xl text-white/95 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 drop-shadow-md">
              أفضل المنتجات شبه الصيدلية والأعشاب الطبية من أشهر الماركات العالمية والمحلية، توصيل لجميع أنحاء المغرب
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-emerald-500 transition-all duration-300 hover:shadow-lg hover:scale-105 drop-shadow-md text-sm sm:text-base"
              >
                تسوق الآن
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white border-2 border-white/50 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-black/40 transition-all duration-300 drop-shadow-md text-sm sm:text-base"
              >
                اعرف المزيد
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-md">300+</div>
                <div className="text-xs sm:text-sm text-white/90 drop-shadow-sm">منتج أصلي</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-md">50+</div>
                <div className="text-xs sm:text-sm text-white/90 drop-shadow-sm">ماركة موثوقة</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-md">10K+</div>
                <div className="text-xs sm:text-sm text-white/90 drop-shadow-sm">عميل راضٍ</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
              <Image
                src="/images/hero-products.png"
                alt="منتجات طبيعية"
                width={400}
                height={400}
                className="rounded-lg sm:rounded-xl shadow-2xl w-full h-auto"
                priority
              />
            </div>
            {/* Background Elements */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-emerald-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-20 h-20 sm:w-32 sm:h-32 bg-teal-200 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
