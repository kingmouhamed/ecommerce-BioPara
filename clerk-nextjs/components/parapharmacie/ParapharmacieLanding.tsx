"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Lock,
  Sparkles,
  Star,
  Heart,
  ShoppingCart,
  Filter,
  Search,
  Menu,
  X,
  User,
  MapPin,
  Clock,
  Package,
  CreditCard,
  ArrowRight,
  Check,
  Zap
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { parapharmacieProductsUnified } from '../../data';
import ParapharmacieProductCard from './ParapharmacieProductCard';
import CategoryHeader from '../category-landing/CategoryHeader';
import {
  getPromoProducts,
  parapharmacieBrands,
  parapharmacieNavCategories,
  parapharmacieQuickCategories
} from './data';

export default function ParapharmacieLanding() {
  const { cartItemCount, addToCart } = useCart();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const promoProducts = useMemo(() => getPromoProducts(parapharmacieProductsUnified), []);
  
  const filteredProducts = useMemo(() => {
    let filtered = parapharmacieProductsUnified;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }
    
    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [selectedCategory, priceRange, selectedBrand, sortBy, query]);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredPromoProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return promoProducts;
    return promoProducts.filter((p) => {
      const title = p.title.toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      return title.includes(q) || brand.includes(q);
    });
  }, [promoProducts, query]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (!section) return;

    const element = document.getElementById(`section-${section}`);
    if (!element) return;

    const t = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    return () => window.clearTimeout(t);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <CategoryHeader
        categoryKey="parapharmacie"
        categoryLabel="البارافارماسي"
        navCategories={parapharmacieNavCategories}
        query={query}
        onQueryChange={setQuery}
        cartItemCount={cartItemCount}
        phoneNumber="+212 673020264"
        whatsappNumber="+212 673020264"
      />

      {/* Enhanced Hero Section */}
      <section className="container mx-auto px-4 pt-6">
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 rounded-3xl overflow-hidden border border-emerald-100 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold mb-6 w-fit">
                <Zap className="w-4 h-4" />
                عروض حصرية لفترة محدودة
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                البارافارماسي
                <span className="block text-emerald-600 text-3xl lg:text-4xl">العناية الطبية المتكاملة</span>
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                اكتشف أفضل المنتجات الطبية والتجميلية من أشهر العلامات التجارية العالمية. 
                ضمان الجودة الأصلية والتوصيل السريع لجميع المدن المغربية.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="group inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg">
                  تسوق الآن
                  <ChevronLeft className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all">
                  عرض الكتالوج
                  <ArrowRight className="w-5 h-5 mr-2" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">منتجات أصلية</div>
                    <div className="text-sm text-gray-600">ضمان 100%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">توصيل سريع</div>
                    <div className="text-sm text-gray-600">24-48 ساعة</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative min-h-[400px] lg:min-h-full bg-gradient-to-br from-emerald-100 to-emerald-50 p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
              
              {/* Special Offers Card */}
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full transform hover:scale-105 transition-transform">
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  خصم 30%
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">عروض اليوم</h3>
                  <p className="text-gray-600">خصومات حصرية على منتجات مختارة</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800">منتجات العناية</span>
                      <span className="text-sm bg-emerald-600 text-white px-2 py-1 rounded-full">جديد</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">وصول أحدث المنتجات</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-800">هدايا مجانية</span>
                      <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full">محدود</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">مع كل طلب فوق 300 درهم</p>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all">
                  اكتشف العروض
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filter Section */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search and Filter Toggle */}
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن منتجات..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold"
              >
                <Filter className="w-5 h-5" />
                الفلاتر
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع التصنيفات</option>
                  {parapharmacieNavCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Brand Dropdown */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع العلامات</option>
                  {parapharmacieBrands.map(brand => (
                    <option key={brand.id} value={brand.name}>{brand.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="popularity">الأكثر شهرة</option>
                  <option value="price-low">السعر: منخفض إلى مرتفع</option>
                  <option value="price-high">السعر: مرتفع إلى منخفض</option>
                  <option value="rating">التقييم</option>
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {isFilterOpen && (
            <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">التصنيف</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">جميع التصنيفات</option>
                    {parapharmacieNavCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">العلامة التجارية</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">جميع العلامات</option>
                    {parapharmacieBrands.map(brand => (
                      <option key={brand.id} value={brand.name}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الترتيب حسب</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="popularity">الأكثر شهرة</option>
                    <option value="price-low">السعر: منخفض إلى مرتفع</option>
                    <option value="price-high">السعر: مرتفع إلى منخفض</option>
                    <option value="rating">التقييم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">نطاق السعر</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="من"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="إلى"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Strip */}
      <section className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-5 flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">دفع آمن</div>
              <div className="text-sm text-emerald-700">تشفير SSL</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-5 flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">توصيل سريع</div>
              <div className="text-sm text-blue-700">24-48 ساعة</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-5 flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">منتجات معتمدة</div>
              <div className="text-sm text-purple-700">جودة موثوقة</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 p-5 flex items-center gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">خصوصية تامة</div>
              <div className="text-sm text-orange-700">بيانات محمية</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Grid */}
      <section className="container mx-auto px-4 mt-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900">المنتجات المميزة</h2>
            <p className="text-gray-600 mt-2">تخفيضات حصرية على منتجات مختارة</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>عرض</span>
            <span className="font-bold text-emerald-600">{filteredProducts.length}</span>
            <span>منتج</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-emerald-200">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
                >
                  <Heart 
                    className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </button>

                {/* Discount Badge */}
                {product.oldPrice && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    أضف للسلة
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-xs text-emerald-600 font-semibold mb-1">{product.brand}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{product.title}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">({product.rating})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-gray-900">{product.price} DH</div>
                    {product.oldPrice && (
                      <div className="text-sm text-gray-400 line-through">{product.oldPrice} DH</div>
                    )}
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-emerald-600 font-bold px-8 py-3 rounded-2xl border-2 border-emerald-200 hover:border-emerald-300 transition-all">
            عرض المزيد من المنتجات
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section id="categories" className="container mx-auto px-4 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-3">تصفح حسب الفئة</h2>
          <p className="text-gray-600 text-lg">اختر الفئة التي تناسب احتياجاتك</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {parapharmacieQuickCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=parapharmacie&section=${cat.id}`}
              className="group text-center"
            >
              <span id={`section-${cat.id}`} className="block relative -top-24" />
              <div className="relative mx-auto w-24 h-24 rounded-2xl bg-white border-2 border-gray-200 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:border-emerald-300 group-hover:scale-110">
                <Image 
                  src={cat.image} 
                  alt={cat.label} 
                  fill 
                  className="object-cover p-4" 
                  sizes="96px" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="mt-3 text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                {cat.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Enhanced Brands Section */}
      <section className="container mx-auto px-4 mt-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-3">علاماتنا التجارية</h2>
            <p className="text-gray-600 text-lg">نقدم أفضل العلامات العالمية والمحلية</p>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-hide">
              {parapharmacieBrands.map((brand, index) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="flex-shrink-0 group"
                  title={brand.name}
                >
                  <div className="w-40 h-20 rounded-2xl border-2 border-gray-100 bg-white flex items-center justify-center hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 hover:shadow-lg">
                    <Image 
                      src={brand.logo} 
                      alt={brand.name} 
                      width={140} 
                      height={50} 
                      className="object-contain h-12 filter grayscale group-hover:grayscale-0 transition-all duration-300" 
                    />
                  </div>
                  <div className="text-center mt-2 text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">
                    {brand.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl transition-all transform hover:scale-105">
              عرض جميع العلامات
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          {/* Enhanced Newsletter */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-8 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <Zap className="w-4 h-4" />
                  عروض حصرية للمشتركين
                </div>
                <h3 className="text-3xl font-black mb-3">اشترك في النشرة الإخبارية</h3>
                <p className="text-emerald-100 text-lg">احصل على أحدث العروض والمنتجات والخصومات الحصرية</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 h-14 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur text-white placeholder-emerald-200 px-6 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 text-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newsletterEmail.trim()) return;
                    setNewsletterEmail('');
                  }}
                  className="h-14 px-8 rounded-2xl bg-white text-emerald-700 font-black text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-xl"
                >
                  اشترك الآن
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Products Column */}
            <div>
              <h4 className="font-black text-xl mb-6 text-emerald-400">منتجاتنا</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/products?category=parapharmacie" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    البارافارماسي
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=medical-herbs" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    الأعشاب الطبية
                  </Link>
                </li>
                <li>
                  <Link href="/promotions" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    العروض والخصومات
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    الوافدون الجدد
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-black text-xl mb-6 text-emerald-400">خدماتنا</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/delivery" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    التوصيل والشحن
                  </Link>
                </li>
                <li>
                  <Link href="/payment" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    طرق الدفع
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    الإرجاع والاستبدال
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    الأسئلة الشائعة
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-black text-xl mb-6 text-emerald-400">الشركة</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" />
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    الوظائف
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    المدونة
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-black text-xl mb-6 text-emerald-400">تواصل معنا</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">الهاتف</div>
                    <div className="text-emerald-300">+212 673020264</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">واتساب</div>
                    <div className="text-green-300">+212 673020264</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">العنوان</div>
                    <div className="text-blue-300">الدار البيضاء، المغرب</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-right">
                <div className="text-lg font-semibold">© {new Date().getFullYear()} BioPara</div>
                <div className="text-gray-400">جميع الحقوق محفوظة</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-gray-400">صنع بـ ❤️ في المغرب</div>
                <div className="flex gap-4">
                  <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    سياسة الخصوصية
                  </Link>
                  <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    الشروط والأحكام
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
