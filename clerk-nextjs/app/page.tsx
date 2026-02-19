"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  Phone,
  Leaf,
  Heart,
  Star,
  Package,
  Clock,
  Award,
  Users,
  CheckCircle,
  Calendar,
  MapPin,
  Mail,
  Globe,
  Target,
  Lightbulb,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import TestimonialCard from '../components/TestimonialCard';
import { herbalProductsUnified } from '../data';

export default function HomePage() {
  const [email, setEmail] = useState('');

  // Get featured medical herbs products
  const featuredProducts = herbalProductsUnified
    .filter(p => p.category === 'medical-herbs')
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Hero Section */}
      <HeroSection
        backgroundImage="/images/backgrounds/medical-herbs-bg.jpg"
        title={
          <>
            الأعشاب الطبية
            <span className="block text-green-600">علاج من الطبيعة</span>
          </>
        }
        subtitle="اكتشف مجموعة مختارة من الأعشاب الطبية النادرة والفعالة. من مصادر موثوقة مع معلومات كاملة عن الفوائد والاستخدام."
        badge={{
          text: "أعشاب طبيعية 100%",
          icon: <Leaf className="w-4 h-4" />
        }}
        primaryAction={{
          text: "تسوق الآن",
          href: "/products?category=medical-herbs"
        }}
        secondaryAction={{
          text: "اكتشف الفوائد",
          href: "#benefits"
        }}
      />

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">فوائد الأعشاب الطبية</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف الفوائد الصحية والعلاجية للأعشاب الطبية التي نقدمها
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors shadow-lg group-hover:shadow-xl">
              <ShieldCheck className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">تعزيز المناعة</h3>
            <p className="text-sm text-gray-600 leading-relaxed">الأعشاب الطبية تقوي جهاز المناعة وتحمي الجسم من الأمراض</p>
          </div>
          <div className="text-center group transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors shadow-lg group-hover:shadow-xl">
              <Heart className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">صحة القلب</h3>
            <p className="text-sm text-gray-600 leading-relaxed">تحسين صحة القلب والأوعية الدموية بشكل طبيعي</p>
          </div>
          <div className="text-center group transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors shadow-lg group-hover:shadow-xl">
              <Star className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">مضاد للأكسدة</h3>
            <p className="text-sm text-gray-600 leading-relaxed">تحتوي على مضادات أكسدة طبيعية تحارب الجذور الحرة</p>
          </div>
          <div className="text-center group transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors shadow-lg group-hover:shadow-xl">
              <Sparkles className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">زيادة الطاقة</h3>
            <p className="text-sm text-gray-600 leading-relaxed">تزيد من مستويات الطاقة والحيوية بشكل طبيعي</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">منتجاتنا المميزة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الأعشاب الطبية التي اخترناها بعناية لك
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="relative bg-gray-50">
                {product.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Leaf className="w-3.5 h-3.5" />
                      {product.badge}
                    </span>
                  </div>
                )}
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={product.image || '/images/placeholders/product-placeholder.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{product.title}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">{product.price} درهم</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice} درهم</span>
                    )}
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    تفاصيل
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/products?category=medical-herbs"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors transform hover:scale-105"
          >
            عرض كل المنتجات
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
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
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors shadow-lg group-hover:shadow-xl">
                <ShieldCheck className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">جودة عالية</h3>
              <p className="text-sm text-gray-600 leading-relaxed">منتجات مختارة بعناية ومضمونة الجودة</p>
            </div>
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors shadow-lg group-hover:shadow-xl">
                <Truck className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">توصيل سريع</h3>
              <p className="text-sm text-gray-600 leading-relaxed">استلام سريع لطلباتك في جميع أنحاء المغرب</p>
            </div>
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors shadow-lg group-hover:shadow-xl">
                <MessageCircle className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">دعم متواصل</h3>
              <p className="text-sm text-gray-600 leading-relaxed">فريق دعم متخصص جاهز لمساعدتك في أي وقت</p>
            </div>
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
                <Target className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">أهدافنا</h3>
              <p className="text-gray-600 leading-relaxed">
                نهدف لتوفير أفضل الأعشاب الطبية لصحة أفضل
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                <Lightbulb className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">خبرة طويلة</h3>
              <p className="text-gray-600 leading-relaxed">
                أكثر من 15 عاماً في مجال الأعشاب الطبية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600">منتج طبي</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
            <div className="text-gray-600">عميل راضي</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
            <div className="text-gray-600">سنة خبرة</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-600">دعم فني</div>
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
                <ShieldCheck className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ضمان الجودة</h3>
              <p className="text-gray-600 leading-relaxed">
                جميع منتجاتنا مضمونة 100% ويمكن إرجاعها
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <MessageCircle className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">استشارات مجانية</h3>
              <p className="text-gray-600 leading-relaxed">
                فريق متخصص لتقديم النصائح الطبية المجانية
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <TrendingUp className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">أسعار تنافسية</h3>
              <p className="text-gray-600 leading-relaxed">
                أفضل الأسعار في السوق مع ضمان الجودة
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

      {/* Blog/News Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">آخر الأخبار</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              اطّلع على آخر المقالات والأخبار عن الأعشاب الطبية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-green-600" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 font-medium text-sm">15 مارس 2024</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-sm">5 دقائق قراءة</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">فوائد الزعتر الطبية</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  اكتشف الفوائد المذهلة للزعتر في علاج العديد من الأمراض وتقوية المناعة
                </p>
                <Link href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  قراءة المزيد ←
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <Leaf className="w-16 h-16 text-blue-600" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 font-medium text-sm">10 مارس 2024</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-sm">7 دقائق قراءة</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">الخزامى وتأثيرها المهدئ</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  كيف يمكن للخزامى أن تساعد في تحسين جودة النوم وتقليل التوتر
                </p>
                <Link href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  قراءة المزيد ←
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                <Heart className="w-16 h-16 text-purple-600" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 font-medium text-sm">5 مارس 2024</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-sm">6 دقائق قراءة</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">البابونج للجهاز الهضمي</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  فوائد البابونج في تحسين الهضم وعلاج مشاكل المعدة
                </p>
                <Link href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  قراءة المزيد ←
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">اشترك في النشرة الإخبارية</h2>
            <p className="text-green-100 text-lg mb-8">
              عروض حصرية على الأعشاب الطبية ومنتجات جديدة تصل إلى بريدك
            </p>
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
                placeholder="name@example.com"
                className="flex-1 h-12 rounded-xl border border-green-400 bg-white/90 backdrop-blur px-4 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-gray-900 placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-white text-green-700 font-bold hover:bg-gray-100 transition-colors"
              >
                اشتراك
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">BioPara</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                منصة متخصصة في بيع الأعشاب الطبية بجودة عالية وأسعار مناسبة. نقدم لك أفضل المنتجات الطبيعية من مصادر موثوقة.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Phone className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/products?category=medical-herbs" className="text-gray-400 hover:text-green-400 transition-colors">الأعشاب الطبية</Link></li>
                <li><Link href="/promotions" className="text-gray-400 hover:text-green-400 transition-colors">العروض</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">اتصل بنا</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-green-400 transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  +212 673020264
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  واتساب: 212673020264
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 text-green-400">📍</span>
                  الدار البيضاء، المغرب
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <div>© {new Date().getFullYear()} BioPara. جميع الحقوق محفوظة.</div>
            <div className="mt-2">صنع بـ ❤️ في المغرب | متخصص في الأعشاب الطبية</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
