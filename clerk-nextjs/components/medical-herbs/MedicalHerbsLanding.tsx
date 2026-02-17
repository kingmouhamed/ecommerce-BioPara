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
  Zap,
  Leaf
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { herbalProductsUnified } from '../../data';
import MedicalHerbsProductCard from './MedicalHerbsProductCard';
import CategoryHeader from '../category-landing/CategoryHeader';
import HeroSection from '../HeroSection';
import {
  getHerbsPromoProducts,
  medicalHerbsBrands,
  medicalHerbsNavCategories,
  medicalHerbsQuickCategories
} from './data';

export default function MedicalHerbsLanding() {
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

  const promoProducts = useMemo(() => getHerbsPromoProducts(herbalProductsUnified), []);
  
  const filteredProducts = useMemo(() => {
    let filtered = herbalProductsUnified;
    
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
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.origin && p.origin.toLowerCase().includes(q)) ||
        (p.benefit && p.benefit.toLowerCase().includes(q))
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
      const origin = (p.origin || '').toLowerCase();
      const benefit = (p.benefit || '').toLowerCase();
      return title.includes(q) || origin.includes(q) || benefit.includes(q);
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
        categoryKey="medical-herbs"
        categoryLabel="الأعشاب الطبية"
        navCategories={medicalHerbsNavCategories}
        query={query}
        onQueryChange={setQuery}
        cartItemCount={cartItemCount}
        phoneNumber="+212 673020264"
        whatsappNumber="+212 673020264"
      />

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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">فوائد الأعشاب الطبية</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف الفوائد الصحية والعلاجية للأعشاب الطبية التي نقدمها
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">تعزيز المناعة</h3>
            <p className="text-gray-700 text-sm">الأعشاب الطبية تقوي جهاز المناعة وتحمي الجسم من الأمراض</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">مضاد للأكسدة</h3>
            <p className="text-gray-700 text-sm">تحتوي على مضادات أكسدة طبيعية تحارب الجذور الحرة</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">زيادة الطاقة</h3>
            <p className="text-gray-700 text-sm">تزيد من مستويات الطاقة والحيوية بشكل طبيعي</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">منتجاتنا المميزة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الأعشاب الطبية التي اخترناها بعناية لك
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.slice(0, 6).map((product) => (
            <MedicalHerbsProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">اشترك في نشرتنا البريدية</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            احصل على أحدث العروض والمعلومات عن الأعشاب الطبية
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
              اشترك
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BioPara</h3>
              <p className="text-gray-400">
                منصة متخصصة في الأعشاب الطبية والبارافارماسي
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">من نحن</Link></li>
                <li><Link href="/products" className="hover:text-white">المنتجات</Link></li>
                <li><Link href="/promotions" className="hover:text-white">العروض</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">خدمة العملاء</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">اتصل بنا</Link></li>
                <li><Link href="/faq" className="hover:text-white">الأسئلة الشائعة</Link></li>
                <li><Link href="/delivery" className="hover:text-white">التوصيل</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">معلومات</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-white">الشروط والأحكام</Link></li>
                <li><Link href="/payment" className="hover:text-white">طرق الدفع</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 BioPara. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
