"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search, ShoppingCart, User, Menu, X, Star, ChevronLeft, 
  Shield, Truck, Clock, Award, Heart, Leaf, CheckCircle, 
  Calendar, UserCheck, ShieldCheck, MessageCircle, Phone, 
  Package, Users, Target, Lightbulb, TrendingUp, Sparkles
} from 'lucide-react';
import { herbalProductsUnified } from '../data';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  const featuredProducts = herbalProductsUnified
    .filter(p => p.category === 'medical-herbs')
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-green-600">BioPara</div>
            
            <nav className="hidden md:flex items-center space-x-reverse space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600">المنتجات</Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600">اتصل بنا</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-reverse space-x-4">
              <button className="p-2 text-gray-600 hover:text-green-600">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">0</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-green-600">الرئيسية</Link>
                <Link href="/products" className="text-gray-700 hover:text-green-600">المنتجات</Link>
                <Link href="/about" className="text-gray-700 hover:text-green-600">من نحن</Link>
                <Link href="/contact" className="text-gray-700 hover:text-green-600">اتصل بنا</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                أعشاب طبية
                <span className="block text-green-600">طبيعية 100%</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                نقدم أفضل أنواع الأعشاب الطبية الطبيعية من مصادر موثوقة لضمان صحتك وسعادتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  تسوق الآن
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                  معرفة المزيد
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl flex items-center justify-center">
                <Leaf className="w-32 h-32 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">منتجاتنا المميزة</h2>
            <p className="text-gray-600 text-lg">اكتشف أفضل الأعشاب الطبية التي اخترناها لك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-square relative bg-gray-50">
                  <img
                    src={product.image || '/images/placeholders/product-placeholder.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">{product.price} درهم</span>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              عرض كل المنتجات
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">من نحن</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              نحن فريق متخصص في الأعشاب الطبية الطبيعية، نقدم لكم أفضل المنتجات من مصادر موثوقة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                <CheckCircle className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">جودة موثوقة</h3>
              <p className="text-gray-600 leading-relaxed">
                نضمن جودة جميع منتجاتنا من مصادر طبيعية 100%
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                <Shield className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ضمان الجودة</h3>
              <p className="text-gray-600 leading-relaxed">
                جميع منتجاتنا مضمونة 100% ويمكن إرجاعها
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                <Award className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">خبرة طويلة</h3>
              <p className="text-gray-600 leading-relaxed">
                أكثر من 15 عاماً في مجال الأعشاب الطبية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">خدماتنا</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              نقدم مجموعة شاملة من الخدمات لضمان رضا عملائنا
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Truck className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">توصيل سريع</h3>
              <p className="text-gray-600 leading-relaxed">
                توصيل لجميع أنحاء المغرب خلال 24-48 ساعة
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Shield className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ضمان الجودة</h3>
              <p className="text-gray-600 leading-relaxed">
                جميع منتجاتنا مضمونة 100% ويمكن إرجاعها
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Heart className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">استشارات مجانية</h3>
              <p className="text-gray-600 leading-relaxed">
                فريق متخصص لتقديم النصائح الطبية المجانية
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Clock className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">دعم 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                فريق دعم متخصص جاهز لمساعدتك في أي وقت
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">فريق العمل</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              تعرف على فريقنا المتخصص في الأعشاب الطبية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <UserCheck className="w-16 h-16 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">د. أحمد محمد</h3>
              <p className="text-green-600 font-medium mb-3">مدير طبي</p>
              <p className="text-gray-600 text-sm">
                خبير في الأعشاب الطبية بأكثر من 20 عاماً خبرة
              </p>
            </div>
            <div className="text-center group">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <UserCheck className="w-16 h-16 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">فاطمة علي</h3>
              <p className="text-green-600 font-medium mb-3">خبيرة تغذية</p>
              <p className="text-gray-600 text-sm">
                متخصصة في التغذية العلاجية والأعشاب الطبيعية
              </p>
            </div>
            <div className="text-center group">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <UserCheck className="w-16 h-16 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">محمد سعيد</h3>
              <p className="text-green-600 font-medium mb-3">صيدلاني</p>
              <p className="text-gray-600 text-sm">
                متخصص في الأدوية العشبية والمكملات الغذائية
              </p>
            </div>
            <div className="text-center group">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <UserCheck className="w-16 h-16 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سارة أحمد</h3>
              <p className="text-green-600 font-medium mb-3">مستشارة طبية</p>
              <p className="text-gray-600 text-sm">
                خبيرة في الطب البديل والعلاج بالأعشاب
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">آراء عملائنا</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              ماذا يقول عملاؤنا عن تجربتهم مع أعشابنا الطبية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "الأعشاب الطبية أصلية 100% والنتائج مذهلة. أنصح الجميع بالتعامل مع BioPara"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-gray-900">فاطمة أحمد</h4>
                  <p className="text-gray-600 text-sm">عميلة منتظمة</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "جودة عالية وأسعار مناسبة جداً. الأعشاب ساعدتني كثيراً في تحسين صحتي"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-gray-900">محمد علي</h4>
                  <p className="text-gray-600 text-sm">عميل دائم</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "خدمة ممتازة ومنتجات متنوعة. سأستمر في التعامل معكم دائماً"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-gray-900">سارة محمد</h4>
                  <p className="text-gray-600 text-sm">عميلة جديدة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">اشترك في نشرتنا الإخبارية</h2>
            <p className="text-green-100 mb-8">احصل على أحدث العروض والمنتجات الجديدة</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) {
                  setEmail('');
                }
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                اشتراك
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BioPara</h3>
              <p className="text-gray-400 text-sm">متخصصون في الأعشاب الطبية الطبيعية</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/shipping" className="hover:text-white transition-colors">الشحن</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">الإرجاع</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+212 673020264</li>
                <li>info@biopara.ma</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} BioPara. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
