"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, MessageCircle, Clock,
  Star, Shield, Truck, Award, CheckCircle,
  Users, Package, TrendingUp, Zap,
} from 'lucide-react';

// ─── Section Components ───────────────────────────────────────────────────────
import HeroCountdown from '@/components/sections/HeroCountdown';
import CategorySection from '@/components/sections/CategorySection';
import BestSellers from '@/components/sections/BestSellers';
import ProductBundles from '@/components/sections/ProductBundles';
import WhyBioPara from '@/components/sections/WhyBioPara';
import Testimonials from '@/components/sections/Testimonials';
import NewsletterSection from '@/components/sections/NewsletterSection';
import Banner from '@/components/layout/Banner';

export default function Home() {
  // ── Animated counters ──────────────────────────────────────────────────────
  const [counters, setCounters] = useState({ customers: 0, products: 0, rating: 0, years: 0 });

  useEffect(() => {
    const targets = { customers: 1000, products: 50, rating: 4.9, years: 3 };
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounters({
        customers: Math.min(Math.floor((targets.customers / steps) * step), targets.customers),
        products: Math.min(Math.floor((targets.products / steps) * step), targets.products),
        rating: Math.min((targets.rating / steps) * step, targets.rating),
        years: Math.min(Math.floor((targets.years / steps) * step), targets.years),
      });
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 py-20 lg:py-32 overflow-hidden" id="hero">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-[url('/images/backgrounds/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        {/* Green glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Content panel ── */}
            <div className="text-center lg:text-right" dir="rtl">
              {/* Promo badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-4 py-2 rounded-full mb-6 text-sm font-bold">
                <Zap className="w-4 h-4" />
                🎁  خصم يصل إلى 25% على الباقات المميزة
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                اكتشف قوة
                <span className="text-emerald-400"> الطبيعة</span>
                <br />
                <span className="text-2xl md:text-3xl font-light text-gray-200 block mt-2">
                  لحياة أكثر صحة ونضارة
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                منتجات طبيعية خالصة معتمدة من مختبرات عالمية. نضمن لك أفضل النتائج بأمانٍ تام وفعالية مثبتة علمياً.
              </p>

              {/* Social proof micro-badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-7">
                {[
                  { icon: Star, label: '4.9/5 تقييم', cls: 'text-yellow-400' },
                  { icon: Users, label: '+1000 عميل راضٍ', cls: 'text-emerald-400' },
                  { icon: Shield, label: 'ضمان الجودة', cls: 'text-emerald-400' },
                  { icon: Truck, label: 'توصيل 24 ساعة', cls: 'text-emerald-400' },
                ].map(({ icon: Icon, label, cls }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cls}`} />
                    <span className="text-white text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-emerald-500 transition-all hover:scale-105 shadow-lg shadow-emerald-900/40"
                >
                  <ShoppingCart className="w-5 h-5" />
                  تصفح المنتجات
                </Link>
                <a
                  href="https://wa.me/212673020264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-white/20 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  اطلب عبر واتساب
                </a>
              </div>

              {/* Countdown timer */}
              <HeroCountdown />
            </div>

            {/* ── Hero Image ── */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/images/backgrounds/hero-herbs.jpg"
                  alt="منتجات BioPara الطبيعية"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Floating badges on image */}
                <div className="absolute top-5 right-5 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black text-sm shadow-lg rotate-3">
                  الأكثر مبيعاً
                </div>
                <div className="absolute bottom-5 left-5 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold text-sm">عضوي 100%</span>
                  </div>
                </div>
              </div>
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-500/20 scale-105 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. ANIMATED STATS BAR
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center" dir="rtl">
            {[
              { val: `+${counters.customers.toLocaleString()}`, label: 'عميل راضٍ', icon: Users },
              { val: `+${counters.products}`, label: 'منتج طبيعي', icon: Package },
              { val: counters.rating.toFixed(1), label: 'تقييم النجوم', icon: Star },
              { val: `${counters.years}+`, label: 'سنوات خبرة', icon: TrendingUp },
            ].map(({ val, label, icon: Icon }) => (
              <div key={label} className="group">
                <div className="text-4xl font-black text-emerald-600 mb-1 tabular-nums">{val}</div>
                <div className="text-gray-500 text-sm flex items-center justify-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. CATEGORIES GRID
      ═══════════════════════════════════════════════════ */}
      <CategorySection />

      {/* ═══════════════════════════════════════════════════
          4. BEST SELLING PRODUCTS
      ═══════════════════════════════════════════════════ */}
      <BestSellers />

      {/* ═══════════════════════════════════════════════════
          5. PRODUCT BUNDLES
      ═══════════════════════════════════════════════════ */}
      <ProductBundles />

      {/* ═══════════════════════════════════════════════════
          PROMO BANNERS
      ═══════════════════════════════════════════════════ */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Banner
              title="عروض مذهلة"
              subtitle="خصم 20% على منتجات الأعشاب والزيوت الطبيعية"
              image="/images/banners/promo-banner.jpg"
              href="/promotions"
            />
            <Banner
              title="التشكيلة الموسمية"
              subtitle="اكتشف أحدث المنتجات الطبيعية المختارة لهذا الموسم"
              image="/images/banners/seasonal-banner.jpg"
              href="/products"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. WHY CHOOSE BIOPARA
      ═══════════════════════════════════════════════════ */}
      <WhyBioPara />

      {/* ═══════════════════════════════════════════════════
          7-DAY GUARANTEE STRIP
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 bg-emerald-600 text-white" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black">ضمان استرجاع 7 أيام</h3>
                <p className="text-emerald-100 text-sm">رضاك الكامل أو استرداد أموالك فوراً</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {['لا أسئلة مطروحة', 'استرداد كامل', 'عملية مبسطة'].map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                  {p}
                </div>
              ))}
            </div>
            <Link
              href="/products"
              className="bg-white text-emerald-700 px-7 py-3 rounded-xl font-black hover:bg-emerald-50 transition-colors shadow-md whitespace-nowrap"
            >
              تسوق الآن بثقة
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <Testimonials />

      {/* ═══════════════════════════════════════════════════
          8. NEWSLETTER + LEAD MAGNET
      ═══════════════════════════════════════════════════ */}
      <NewsletterSection />
    </div>
  );
}
