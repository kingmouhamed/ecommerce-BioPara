"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Globe, 
  Shield, 
  Award, 
  Truck, 
  Star, 
  ChevronLeft, 
  Menu, 
  X,
  Search,
  ShoppingCart,
  User,
  Heart
} from 'lucide-react';

export default function ArabicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'دولار أمريكي' },
    { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'يورو' },
    { code: 'SAR', symbol: 'ر.س', flag: '🇸🇦', name: 'ريال سعودي' },
    { code: 'MAD', symbol: 'د.م', flag: '🇲🇦', name: 'درهم مغربي' }
  ];

  const languages = [
    { code: 'AR', name: 'العربية', flag: '🇸🇦' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'EN', name: 'English', flag: '🇬🇧' }
  ];

  return (
    <>
      {/* Worldwide Shipping Banner */}
      <div className="shipping-banner">
        <div className="container-premium flex items-center justify-center gap-2">
          <Truck className="w-4 h-4" />
          <span className="font-medium">شحن عالمي • موثوق من قبل أكثر من 1 مليون عميل</span>
          <Shield className="w-4 h-4" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[var(--color-surface)] border-b border-gray-100 sticky top-0 z-50 shadow-premium">
        <div className="container-premium">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-xl flex items-center justify-center shadow-premium group-hover:shadow-premium-lg transition-all duration-300">
                <span className="text-white font-bold text-xl">ب</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary">بيوبارا</h1>
                <p className="text-xs text-[var(--color-text-secondary)]">العافية الطبيعية الفاخرة</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6">
                <Link href="/" className="nav-link nav-link-active">الرئيسية</Link>
                <Link href="/products" className="nav-link">المنتجات</Link>
                <Link href="/about" className="nav-link">من نحن</Link>
                <Link href="/contact" className="nav-link">اتصل بنا</Link>
              </div>

              {/* Language & Currency Selectors */}
              <div className="flex items-center gap-4">
                {/* Currency Selector */}
                <div className="relative group">
                  <button className="selector-dropdown flex items-center gap-2">
                    <span>🇲🇦</span>
                    <span>د.م</span>
                    <ChevronLeft className="w-3 h-3 rotate-90" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-premium-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    {currencies.map((currency) => (
                      <button key={currency.code} className="w-full px-4 py-3 text-right hover:bg-[var(--color-surface-alt)] transition-colors flex items-center justify-end gap-3">
                        <span>{currency.name}</span>
                        <span>{currency.code}</span>
                        <span>{currency.flag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Selector */}
                <div className="relative group">
                  <button className="selector-dropdown flex items-center gap-2">
                    <span>🇸🇦</span>
                    <span>العربية</span>
                    <ChevronLeft className="w-3 h-3 rotate-90" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-premium-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    {languages.map((language) => (
                      <button key={language.code} className="w-full px-4 py-3 text-right hover:bg-[var(--color-surface-alt)] transition-colors flex items-center justify-end gap-3">
                        <span>{language.name}</span>
                        <span>{language.flag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <Search className="w-5 h-5 text-[var(--color-text-primary)]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
                  <Heart className="w-5 h-5 text-[var(--color-text-primary)]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors relative">
                  <ShoppingCart className="w-5 h-5 text-[var(--color-text-primary)]" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-accent)] text-white text-xs rounded-full flex items-center justify-center">2</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
                  <User className="w-5 h-5 text-[var(--color-text-primary)]" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden border-t border-gray-100 transition-all duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
          <div className="container-premium py-4 space-y-4">
            <div className="space-y-2">
              <Link href="/" className="block px-4 py-2 nav-link text-right">الرئيسية</Link>
              <Link href="/products" className="block px-4 py-2 nav-link text-right">المنتجات</Link>
              <Link href="/about" className="block px-4 py-2 nav-link text-right">من نحن</Link>
              <Link href="/contact" className="block px-4 py-2 nav-link text-right">اتصل بنا</Link>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button className="selector-dropdown flex items-center gap-2">
                <span>🇲🇦</span>
                <span>د.م</span>
              </button>
              <button className="selector-dropdown flex items-center gap-2">
                <span>🇸🇦</span>
                <span>العربية</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl shadow-premium-lg w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder="ابحث عن منتجات طبيعية فاخرة..."
                  className="flex-1 text-lg outline-none text-right"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Suggestions */}
              <div className="space-y-2">
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 text-right">عمليات البحث الشائعة</p>
                <div className="flex flex-wrap gap-2 justify-end">
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">زيت الأرغان</span>
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">شاي الأعشاب</span>
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">العناية الطبيعية</span>
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">منتجات عضوية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
