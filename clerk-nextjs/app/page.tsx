"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  Phone
} from 'lucide-react';
import CategoriesGrid from '../components/CategoriesGrid';
import HeroSection from '../components/HeroSection';
import TestimonialCard from '../components/TestimonialCard';

export default function HomePage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Hero Section */}
      <HeroSection
        title="مرحباً بك في BioPara"
        subtitle="منتجات طبيعية وعلاجية مختارة بعناية. اكتشف الأعشاب الطبية والبارافارماسي بجودة عالية."
        badge={{
          text: "جودة عالمية، منتجات طبيعية",
          icon: <Sparkles className="w-4 h-4" />
        }}
        primaryAction={{
          text: "الأعشاب الطبية",
          href: "/products?category=medical-herbs"
        }}
        secondaryAction={{
          text: "البارافارماسي",
          href: "/products?category=parapharmacie"
        }}
      />

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">اختر القسم الذي يناسبك</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            تصفح منتجاتنا الطبيعية والعلاجية، كل قسم يحتوي على منتجات مختارة بعناية لتناسب احتياجاتك
          </p>
        </div>
        <CategoriesGrid />
      </section>

      {/* Features Section */}
      <section className="bg-white border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">لماذا BioPara؟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم لك تجربة تسوق مميزة ومنتجات عالية الجودة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors shadow-lg group-hover:shadow-xl">
                <ShieldCheck className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">جودة عالية</h3>
              <p className="text-sm text-gray-600 leading-relaxed">منتجات مختارة بعناية ومضمونة الجودة</p>
            </div>
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors shadow-lg group-hover:shadow-xl">
                <Truck className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">توصيل سريع</h3>
              <p className="text-sm text-gray-600 leading-relaxed">استلام سريع لطلباتك في جميع أنحاء المغرب</p>
            </div>
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors shadow-lg group-hover:shadow-xl">
                <MessageCircle className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">دعم متواصل</h3>
              <p className="text-sm text-gray-600 leading-relaxed">فريق دعم متخصص جاهز لمساعدتك في أي وقت</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">آراء عملائنا</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ماذا يقول عملاؤنا عن تجربتهم مع BioPara
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            name="فاطمة أحمد"
            role="عميلة منتظمة"
            avatar="/images/testimonials/testimonial-1.jpg"
            content="منتجات عالية الجودة وتوصيل سريع جداً. أنصح الجميع بالتعامل مع BioPara"
            rating={5}
          />
          <TestimonialCard
            name="محمد علي"
            role="عميل دائم"
            avatar="/images/testimonials/testimonial-2.jpg"
            content="الأعشاب الطبية أصلية 100% والأسعار مناسبة. شكراً لكم"
            rating={5}
          />
          <TestimonialCard
            name="سارة محمد"
            role="عميلة جديدة"
            avatar="/images/testimonials/testimonial-3.jpg"
            content="خدمة ممتازة ومنتجات متنوعة. سأستمر في التعامل معكم"
            rating={5}
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-extrabold text-white mb-2">اشترك في النشرة الإخبارية</h3>
            <p className="text-emerald-100">عروض حصرية ومنتجات جديدة تصل إلى بريدك</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) {
                setEmail('');
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="flex-1 h-12 rounded-2xl border border-emerald-400 bg-white/90 backdrop-blur px-4 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-2xl bg-white text-emerald-700 font-bold transition-colors transform hover:scale-105 hover:shadow-lg"
            >
              اشتراك
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-bold text-lg mb-4">BioPara</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                منصة متخصصة في بيع المنتجات الطبيعية والعلاجية بجودة عالية وأسعار مناسبة
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products?category=medical-herbs" className="text-gray-400 hover:text-emerald-400 transition-colors">الأعشاب الطبية</Link></li>
                <li><Link href="/products?category=parapharmacie" className="text-gray-400 hover:text-emerald-400 transition-colors">البارافارماسي</Link></li>
                <li><Link href="/promotions" className="text-gray-400 hover:text-emerald-400 transition-colors">العروض</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  +212 673020264
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  واتساب: 212673020264
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 text-emerald-400">📍</span>
                  الدار البيضاء، المغرب
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
            <div>© {new Date().getFullYear()} BioPara. جميع الحقوق محفوظة.</div>
            <div className="mt-2">صنع بـ ❤️ في المغرب</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
