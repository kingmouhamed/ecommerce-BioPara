"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Leaf, Heart, Star, ShoppingCart, User, Menu, X, 
  MessageCircle, ChevronLeft, ChevronRight, Mail, Phone,
  MapPin, Facebook, Instagram
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Mock data
  const bestSellers = [
    { id: 1, name: "زيت الأرغان العضوي", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/lavender-herb.jpg" },
    { id: 2, name: "شاي الزنجبيل الأخضر", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/ginger-herb.jpg" },
    { id: 3, name: "مستخلص البابونج", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/camomile-herb.jpg" },
    { id: 4, name: "زيت اللافندر الأساسي", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/lavender-herb.jpg" },
    { id: 5, name: "خلاصة الكركم", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/turmeric-herb.jpg" },
    { id: 6, name: "شاي الأعشاب المتعددة", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/mint-herb.jpg" },
    { id: 7, name: "زيت النعناع", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/mint-herb.jpg" },
    { id: 8, name: "مستخلص إشنسا", rating: 5, price: "199 د.م.", image: "/images/medical-herbs/rosemary-herb.jpg" }
  ];

  const customerReviews = [
    { id: 1, name: "فاطمة أحمد", rating: 5, comment: "منتجات ممتازة وجودة عالية. استخدمت زيت الأرغان وكانت النتائج مذهلة!", productImage: "/images/medical-herbs/lavender-herb.jpg" },
    { id: 2, name: "محمد العلي", rating: 5, comment: "خدمة توصيل سريعة ومنتجات أصلية 100%. أنصح بالتعامل معهم", productImage: "/images/medical-herbs/ginger-herb.jpg" },
    { id: 3, name: "نورة سعيد", rating: 5, comment: "الأعشاب الطبية ساعدتني كثيراً في تحسين صحتي. شكراً لكم", productImage: "/images/medical-herbs/camomile-herb.jpg" }
  ];

  const blogArticles = [
    { id: 1, title: "فوائد زيت الأرغان للبشرة", date: "15 يناير 2024", image: "/images/medical-herbs/lavender-herb.jpg" },
    { id: 2, title: "كيف تقوي مناعتك طبيعياً", date: "10 يناير 2024", image: "/images/medical-herbs/turmeric-herb.jpg" },
    { id: 3, title: "فن تحضير شاي الأعشاب", date: "5 يناير 2024", image: "/images/medical-herbs/mint-herb.jpg" }
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
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold text-green-600">BioPara</span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">منتجاتنا</Link>
              <Link href="/consultation" className="text-gray-700 hover:text-green-600 transition-colors">استشارات</Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">من نحن</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" aria-label="Account" className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
              <Link href="/cart" aria-label="Shopping cart" className="p-2 text-gray-600 hover:text-green-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
              
              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">الرئيسية</Link>
                <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">منتجاتنا</Link>
                <Link href="/consultation" className="text-gray-700 hover:text-green-600 transition-colors">استشارات</Link>
                <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">من نحن</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Right Content */}
            <div className="text-center lg:text-right">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                BioPara: رحلتك نحو الشفاء الطبيعي والروحي
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                نقدم لك أفضل المنتجات الطبيعية والعلاجات العشبية لتحسين صحتك وجسدك وروحك
              </p>
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg">
                ابدأ الاستشارة الآن
              </button>
            </div>
            
            {/* Left Imagery */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-32 w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/images/medical-herbs/lavender-herb.jpg"
                      alt="BioPara Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-32 w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/images/medical-herbs/ginger-herb.jpg"
                      alt="BioPara Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative h-48 w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/images/about/team-photo.jpg"
                      alt="Happy Customer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-16 w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/images/medical-herbs/camomile-herb.jpg"
                      alt="BioPara Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">الأكثر مبيعاً</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="relative h-40 w-full mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                </div>
                <p className="text-lg font-bold text-green-600">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">آراء عملائنا</h2>
          
          <div className="relative">
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={prevReview}
                aria-label="Previous review"
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {customerReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className={`bg-white rounded-lg p-6 shadow-md transition-all duration-300 ${
                      index === currentReviewIndex ? 'scale-105 shadow-xl' : 'opacity-50'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-600 mb-4">&ldquo;{review.comment}&rdquo;</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{review.name}</p>
                      <div className="relative w-8 h-8">
                        <Image
                          src={review.productImage}
                          alt="Product"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={nextReview}
                aria-label="Next review"
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Herbal Guide Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">دليل الأعشاب</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500">{article.date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / WhatsApp Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">رسائل العملاء على واتساب</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {whatsappChats.map((chat) => (
              <div key={chat.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-600 p-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">واتساب</span>
                </div>
                <div className="p-4">
                  <div className="bg-green-100 rounded-lg p-3 mb-2">
                    <p className="text-gray-800 text-sm">{chat.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 text-left">{chat.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Trust Badges */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">Fabriqué Par</span>
                </div>
                <span className="text-green-400 font-bold">Theropla</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">ISO</span>
                </div>
                <span className="text-green-400">9001</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-4">اشترك في نشرتنا الإخبارية</h3>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                اشترك
              </button>
            </div>
          </div>

          {/* Links and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">منتجاتنا</Link></li>
                <li><Link href="/consultation" className="text-gray-400 hover:text-white transition-colors">استشارات</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">الدعم</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">الخصوصية</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">الشروط</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">معلومات الاتصال</h4>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  +966 50 000 000
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  info@biopara.com
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  الرياض، المملكة العربية السعودية
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">تابعنا</h4>
              <div className="flex gap-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2024 BioPara. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
