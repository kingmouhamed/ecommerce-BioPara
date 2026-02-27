"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Leaf, Heart, Star, ShoppingCart, User, Menu, X,
  MessageCircle, ChevronLeft, ChevronRight, Mail, Phone,
  MapPin, Facebook, Instagram, Shield, Truck, Clock,
  CheckCircle, Award, TrendingUp, Users, Package,
  ThumbsUp, ArrowRight, Zap, HeadphonesIcon,
  Sparkles, Gift, RefreshCw
} from 'lucide-react';
import CategorySection from '../components/sections/CategorySection';
import BestSellers from '../components/sections/BestSellers';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    rating: 0,
    years: 0
  });

  // Animated counters
  useEffect(() => {
    const targetValues = {
      customers: 1000,
      products: 50,
      rating: 4.9,
      years: 3
    };

    const duration = 2000;
    const steps = 60;
    const increment = {
      customers: targetValues.customers / steps,
      products: targetValues.products / steps,
      rating: targetValues.rating / steps,
      years: targetValues.years / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounters({
        customers: Math.min(Math.floor(increment.customers * currentStep), targetValues.customers),
        products: Math.min(Math.floor(increment.products * currentStep), targetValues.products),
        rating: Math.min(increment.rating * currentStep, targetValues.rating),
        years: Math.min(Math.floor(increment.years * currentStep), targetValues.years)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Mock data
  const customerReviews = [
    { 
      id: 1, 
      name: "فاطمة أحمد", 
      rating: 5, 
      comment: "منتجات ممتازة وجودة عالية. استخدمت زيت الأرغان وكانت النتائج مذهلة!", 
      productImage: "/images/medicinal-oils/argan-oil.jpg",
      avatar: "/images/placeholder.svg"
    },
    { 
      id: 2, 
      name: "محمد العلي", 
      rating: 5, 
      comment: "خدمة توصيل سريعة ومنتجات أصلية 100%. أنصح بالتعامل معهم", 
      productImage: "/images/medicinal-herbs/ginger-herb.jpg",
      avatar: "/images/placeholder.svg"
    },
    { 
      id: 3, 
      name: "نورة سعيد", 
      rating: 5, 
      comment: "الأعشاب الطبية ساعدتني كثيراً في تحسين صحتي. شكراً لكم", 
      productImage: "/images/medicinal-herbs/camomile-herb.jpg",
      avatar: "/images/placeholder.svg"
    }
  ];

  const blogArticles = [
    { 
      id: 1, 
      title: "فوائد زيت الأرغان للبشرة", 
      date: "15 يناير 2024", 
      image: "/images/medicinal-oils/argan-oil.jpg",
      readTime: "5 دقائق",
      excerpt: "اكتشف فوائد زيت الأرغان المغربي الأصيل لبشرة مشرقة وصحة مثالية"
    },
    { 
      id: 2, 
      title: "كيف تقوي مناعتك طبيعياً", 
      date: "10 يناير 2024", 
      image: "/images/dietary-supplements/vitamin-d3-k2.jpg",
      readTime: "7 دقائق",
      excerpt: "دليل شامل لتعزيز جهاز المناعة بطرق طبيعية وآمنة"
    },
    { 
      id: 3, 
      title: "فن تحضير شاي الأعشاب", 
      date: "5 يناير 2024", 
      image: "/images/medicinal-herbs/mint-herb.jpg",
      readTime: "4 دقائق",
      excerpt: "تعلم طرق تحضير شاي الأعشاب للاستفادة القصوى من فوائدها"
    }
  ];

  const whatsappChats = [
    { id: 1, message: "المنتجات رائعة جداً وشاهدت نتائج مذهلة! شكراً BioPara", time: "10:30 ص" },
    { id: 2, message: "خدمة ممتازة وتوصيل سريع. أنصح الجميع بالتجربة", time: "9:15 ص" },
    { id: 3, message: "الأعشاب الطبيعية ساعدتني كثيراً في تحسين صحتي", time: "8:45 ص" }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % customerReviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + customerReviews.length) % customerReviews.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
          <Gift className="w-4 h-4" />
          <span>توصيل مجاني للطلبات فوق 299 درهم - شحن خلال 24 ساعة</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-emerald-600 text-white py-2 px-4">
        <div className="container mx-auto flex flex-wrap justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>توصيل سريع خلال 24 ساعة</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>دفع عند الاستلام</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            <span>منتجات طبيعية 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>دعم مباشر عبر واتساب</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <Image
                src="/images/logo.png"
                alt="BioPara"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-emerald-700">BioPara</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">المنتجات</Link>
              <Link href="/about" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">اتصل بنا</Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/sign-in" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                تسجيل الدخول
              </Link>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Apple-level Design */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/backgrounds/hero-bg.jpg')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/95"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">جودة عضوية مضمونة</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                اكتشف قوة
                <span className="text-emerald-600"> الطبيعة</span>
                <br />
                <span className="text-2xl md:text-4xl font-light">لحياة أكثر صحة ونضارة</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                منتجات طبيعية خالصة معتمدة من مختبرات عالمية. نضمن لك أفضل النتائج بأمان تام وفعالية مثبتة علمياً.
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-gray-700 font-medium">4.9/5 تقييم</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700 font-medium">+1000 عميل راضٍ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700 font-medium">ضمان الجودة</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">منتجات عضوية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">جودة معتمدة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">توصيل 24 ساعة</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  تصفح المنتجات
                </Link>
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  اطلب عبر واتساب
                </a>
              </div>

              {/* Urgency Element */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-600 font-medium">
                <Clock className="w-4 h-4" />
                <span>عرض محدود - توصيل خلال 24 ساعة</span>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/images/backgrounds/hero-herbs.jpg"
                  alt="منتجات BioPara الطبيعية"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl w-full"
                  priority
                />
                {/* Floating badges */}
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transform rotate-12">
                  الأكثر مبيعاً
                </div>
                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  جودة عضوية
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                +{counters.customers.toLocaleString()}
              </div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                <span>عميل راضٍ</span>
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                +{counters.products}
              </div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                <span>منتج طبيعي</span>
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {counters.rating}
              </div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>تقييم النجوم</span>
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {counters.years}+
              </div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>سنوات خبرة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار BioPara؟</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نلتزم بتقديم أفضل المنتجات الطبيعية مع ضمان الجودة والخدمة المميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <Shield className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">جودة عضوية مضمونة</h3>
              <p className="text-gray-600">
                جميع منتجاتنا حاصلة على شهادات العضوية والجودة من جهات معتمدة عالمياً
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <Award className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">مختبرات معتمدة</h3>
              <p className="text-gray-600">
                نخضع جميع منتجاتنا لفحوصات مخبرية صارمة لضمان النقاء والفعالية
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <ThumbsUp className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">نتائج مثبتة</h3>
              <p className="text-gray-600">
                آلاف العملاء يشهدون بالنتائج المذهلة لمنتجاتنا الطبيعية
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <HeadphonesIcon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">دعم سريع</h3>
              <p className="text-gray-600">
                فريق دعم متخصص متاح 24/7 للإجابة على جميع استفساراتكم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Day Guarantee Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <RefreshCw className="w-8 h-8" />
              <h2 className="text-3xl font-bold">ضمان استرجاع 7 أيام</h2>
            </div>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              نحن واثقون من جودة منتجاتنا. إذا لم تكن راضياً 100%، يمكنك استرجاع المنتج خلال 7 أيام واسترداد أموالك بالكامل.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>لا أسئلة مطروحة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>استرداد كامل</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>عملية سهلة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategorySection />

      {/* Best Sellers Section - Enhanced */}
      <BestSellers />

      {/* Customer Reviews Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">آراء عملائنا</h2>
            <p className="text-xl text-gray-600 mb-2">تقييمات حقيقية 100%</p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-600 font-medium">4.9 من 5 تقييم</span>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={prevReview}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                aria-label="السابق"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customerReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 ${
                      index === currentReviewIndex ? 'scale-105 shadow-xl border-2 border-emerald-200' : 'opacity-50 scale-95'
                    }`}
                  >
                    <div className="flex items-center mb-6">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover ml-4"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-2">
                      <Image
                        src={review.productImage}
                        alt="المنتج"
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <span className="text-sm text-gray-500">منتج معتمد</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={nextReview}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                aria-label="التالي"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Enhanced */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">دليل الأعشاب</h2>
            <p className="text-xl text-gray-600">مقالات ومعلومات مفيدة عن الأعشاب والمنتجات الطبيعية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.map((article) => (
              <article key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-white/90 backdrop-blur text-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>
                  <Link
                    href={`/blog/${article.id}`}
                    className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                  >
                    اقرأ المزيد
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Chats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">رسائل العملاء على واتساب</h2>
            <p className="text-xl text-gray-600">آراء حقيقية من عملائنا الكرام</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {whatsappChats.map((chat) => (
              <div key={chat.id} className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <p className="text-gray-800 leading-relaxed">{chat.message}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 mr-4">{chat.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/logo.png"
                  alt="BioPara"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">BioPara</span>
              </div>
              <p className="text-gray-400 mb-4">
                متجر متخصص في المنتجات الطبيعية والأعشاب والزيوت والمكملات الغذائية عالية الجودة
              </p>
              <div className="flex gap-4">
                <a href="#" title="Facebook" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" title="Instagram" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">المدونة</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold mb-4">خدمة العملاء</h3>
              <ul className="space-y-2">
                <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">الشحن والتوصيل</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">سياسة الإرجاع</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">شروط الاستخدام</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">+212 600-000-000</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>info@biopara.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>المغرب - الدار البيضاء</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400">
                © 2024 BioPara. جميع الحقوق محفوظة.
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">وسائل الدفع:</span>
                <div className="flex gap-2">
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">VISA</div>
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">MC</div>
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">COD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button with Pulse */}
      <a
        href="https://wa.me/212600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110 z-50 animate-pulse"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
