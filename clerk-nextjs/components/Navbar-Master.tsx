"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronLeft,
  Globe, 
  Shield, 
  Award, 
  Truck, 
  Star,
  Heart
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

// TypeScript Interface for Props
interface NavbarProps {
  locale?: 'ar' | 'en' | 'fr';
  variant?: 'default' | 'premium';
  showLanguageSelector?: boolean;
  showCurrencySelector?: boolean;
  showShippingBanner?: boolean;
}

export default function Navbar({ 
  locale = 'ar', 
  variant = 'default',
  showLanguageSelector = false,
  showCurrencySelector = false,
  showShippingBanner = false
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  // Localization Data
  const localization = {
    ar: {
      logo: { text: 'بيوبارا', letter: 'ب', tagline: 'العافية الطبيعية الفاخرة' },
      nav: { home: 'الرئيسية', products: 'المنتجات', about: 'من نحن', contact: 'اتصل بنا', brands: 'الماركات', promotions: 'العروض' },
      search: { placeholder: 'ابحث...' },
      shippingBanner: 'شحن عالمي • موثوق من قبل أكثر من 1 مليون عميل',
      categories: [
        { name: 'الأعشاب الطبية', href: '/products?category=الأعشاب الطبية' },
        { name: 'Parapharmacie', href: '/products?category=Parapharmacie' }
      ],
      brands: [
        { name: 'La Roche-Posay', href: '/brands/la-roche-posay' },
        { name: 'Vichy', href: '/brands/vichy' },
        { name: 'CeraVe', href: '/brands/cerave' },
        { name: 'Bioderma', href: '/brands/bioderma' },
        { name: 'Avène', href: '/brands/avene' },
        { name: 'Nuxe', href: '/brands/nuxe' },
        { name: 'Uriage', href: '/brands/uriage' },
        { name: 'Mustela', href: '/brands/mustela' },
        { name: 'Eucerin', href: '/brands/eucerin' },
        { name: 'SVR', href: '/brands/svr' },
        { name: 'Filorga', href: '/brands/filorga' },
        { name: 'BioOriental', href: '/brands/bio-oriental' }
      ]
    },
    en: {
      logo: { text: 'BioPara', letter: 'B', tagline: 'Premium Natural Wellness' },
      nav: { home: 'Home', products: 'Products', about: 'About', contact: 'Contact', brands: 'Brands', promotions: 'Promotions' },
      search: { placeholder: 'Search...' },
      shippingBanner: 'Worldwide Shipping • Trusted by 1M+ Customers',
      categories: [
        { name: 'Herbal Medicine', href: '/products?category=Herbal Medicine' },
        { name: 'Parapharmacie', href: '/products?category=Parapharmacie' }
      ],
      brands: [
        { name: 'La Roche-Posay', href: '/brands/la-roche-posay' },
        { name: 'Vichy', href: '/brands/vichy' },
        { name: 'CeraVe', href: '/brands/cerave' },
        { name: 'Bioderma', href: '/brands/bioderma' },
        { name: 'Avène', href: '/brands/avene' },
        { name: 'Nuxe', href: '/brands/nuxe' },
        { name: 'Uriage', href: '/brands/uriage' },
        { name: 'Mustela', href: '/brands/mustela' },
        { name: 'Eucerin', href: '/brands/eucerin' },
        { name: 'SVR', href: '/brands/svr' },
        { name: 'Filorga', href: '/brands/filorga' },
        { name: 'BioOriental', href: '/brands/bio-oriental' }
      ]
    },
    fr: {
      logo: { text: 'BioPara', letter: 'B', tagline: 'Bien-être Naturel Premium' },
      nav: { home: 'Accueil', products: 'Produits', about: 'À propos', contact: 'Contact', brands: 'Marques', promotions: 'Promotions' },
      search: { placeholder: 'Rechercher...' },
      shippingBanner: 'Expédition Mondiale • Approuvé par 1M+ Clients',
      categories: [
        { name: 'Médecine Herboriste', href: '/products?category=Médecine Herboriste' },
        { name: 'Parapharmacie', href: '/products?category=Parapharmacie' }
      ],
      brands: [
        { name: 'La Roche-Posay', href: '/brands/la-roche-posay' },
        { name: 'Vichy', href: '/brands/vichy' },
        { name: 'CeraVe', href: '/brands/cerave' },
        { name: 'Bioderma', href: '/brands/bioderma' },
        { name: 'Avène', href: '/brands/avene' },
        { name: 'Nuxe', href: '/brands/nuxe' },
        { name: 'Uriage', href: '/brands/uriage' },
        { name: 'Mustela', href: '/brands/mustela' },
        { name: 'Eucerin', href: '/brands/eucerin' },
        { name: 'SVR', href: '/brands/svr' },
        { name: 'Filorga', href: '/brands/filorga' },
        { name: 'BioOriental', href: '/brands/bio-oriental' }
      ]
    }
  };

  const currentLang = localization[locale as keyof typeof localization] || localization.ar;

  // Currency and Language Data
  const currencies = [
    { code: 'USD', symbol: '$', flag: '🇺🇸', name: locale === 'ar' ? 'دولار أمريكي' : 'US Dollar' },
    { code: 'EUR', symbol: '€', flag: '🇪🇺', name: locale === 'ar' ? 'يورو' : 'Euro' },
    { code: 'SAR', symbol: locale === 'ar' ? 'ر.س' : 'SR', flag: '🇸🇦', name: locale === 'ar' ? 'ريال سعودي' : 'Saudi Riyal' },
    { code: 'MAD', symbol: locale === 'ar' ? 'د.م' : 'MAD', flag: '🇲🇦', name: locale === 'ar' ? 'درهم مغربي' : 'Moroccan Dirham' }
  ];

  const languages = [
    { code: 'AR', name: 'العربية', flag: '🇸🇦' },
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('shadow-lg');
        } else {
          navbar.classList.remove('shadow-lg');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CSS Classes based on variant
  const getNavbarClasses = () => {
    const baseClasses = "sticky top-0 z-50 transition-shadow duration-300";
    const variantClasses = variant === 'premium' 
      ? "bg-[var(--color-surface)] border-b border-gray-100 shadow-premium"
      : "bg-white";
    return `${baseClasses} ${variantClasses}`;
  };

  const getContainerClasses = () => {
    return variant === 'premium' ? 'container-premium' : 'container mx-auto px-4';
  };

  const getLogoClasses = () => {
    const baseClasses = "flex items-center gap-2";
    return variant === 'premium' ? `${baseClasses} gap-3 group` : baseClasses;
  };

  return (
    <nav id="navbar" className={getNavbarClasses()} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Shipping Banner */}
      {showShippingBanner && variant === 'premium' && (
        <div className="shipping-banner">
          <div className="container-premium flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            <span className="font-medium">{currentLang.shippingBanner}</span>
            <Shield className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className={getContainerClasses()}>
        {/* Top Bar - Default Variant Only */}
        {variant === 'default' && (
          <div className="border-b border-gray-100 py-2">
            <div className="flex justify-between items-center">
              <div className="hidden sm:flex items-center gap-2 text-gray-600">
                <span className="text-xs sm:text-sm">📞 +212 673020264</span>
                <span className="text-xs sm:text-sm">✉️ biopara@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard/favorites" className="text-gray-600 hover:text-emerald-600 transition-colors text-xs sm:text-sm">
                  {locale === 'ar' ? 'المفضلة' : 'Favorites'}
                </Link>
                <Link href="/auth/login" className="text-gray-600 hover:text-emerald-600 transition-colors text-xs sm:text-sm whitespace-nowrap">
                  {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className={variant === 'premium' ? 'py-4' : 'py-4'}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className={getLogoClasses()}>
              {variant === 'premium' ? (
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-xl flex items-center justify-center shadow-premium group-hover:shadow-premium-lg transition-all duration-300">
                  <span className="text-white font-bold text-xl">{currentLang.logo.letter}</span>
                </div>
              ) : (
                <Image
                  src="/images/logo.png"
                  alt="BioPara Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              )}
              <div>
                <h1 className={`${variant === 'premium' ? 'text-2xl font-bold text-gradient-primary' : 'text-lg sm:text-xl font-bold text-gray-900'}`}>
                  {currentLang.logo.text}
                </h1>
                {variant === 'premium' && (
                  <p className="text-xs text-[var(--color-text-secondary)]">{currentLang.logo.tagline}</p>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className={`font-medium transition-colors ${
                    pathname === '/' ? 'text-emerald-600' : 
                    variant === 'premium' ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {currentLang.nav.home}
                </Link>
                
                {/* Categories Dropdown */}
                {variant === 'default' && (
                  <div className="relative">
                    <button
                      onMouseEnter={() => {
                        setTimeout(() => setIsCategoriesOpen(true), 150);
                      }}
                      onMouseLeave={() => {
                        setTimeout(() => setIsCategoriesOpen(false), 200);
                      }}
                      className="flex items-center gap-1 font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                    >
                      {currentLang.nav.products}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {isCategoriesOpen && (
                      <div
                        onMouseEnter={() => setIsCategoriesOpen(true)}
                        onMouseLeave={() => {
                          setTimeout(() => setIsCategoriesOpen(false), 200);
                        }}
                        className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 transition-all duration-300 ease-in-out transform origin-top"
                      >
                        {currentLang.categories.map((category: { name: string; href: string }, index: number) => (
                          <Link
                            key={index}
                            href={category.href}
                            className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            href="/products"
                            className="block px-4 py-3 text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
                          >
                            {locale === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  href="/about"
                  className={`font-medium transition-colors ${
                    pathname === '/about' ? 'text-emerald-600' : 
                    variant === 'premium' ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {currentLang.nav.about}
                </Link>
                <Link
                  href="/contact"
                  className={`font-medium transition-colors ${
                    pathname === '/contact' ? 'text-emerald-600' : 
                    variant === 'premium' ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {currentLang.nav.contact}
                </Link>
              </div>

              {/* Language & Currency Selectors - Premium Variant */}
              {variant === 'premium' && (showLanguageSelector || showCurrencySelector) && (
                <div className="flex items-center gap-4">
                  {/* Currency Selector */}
                  {showCurrencySelector && (
                    <div className="relative group">
                      <button className="selector-dropdown flex items-center gap-2">
                        <span>🇲🇦</span>
                        <span>د.م</span>
                        <ChevronLeft className="w-3 h-3 rotate-90" />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-premium-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        {currencies.map((currency: { code: string; symbol: string; flag: string; name: string }) => (
                          <button key={currency.code} className="w-full px-4 py-3 text-right hover:bg-[var(--color-surface-alt)] transition-colors flex items-center justify-end gap-3">
                            <span>{currency.name}</span>
                            <span>{currency.code}</span>
                            <span>{currency.flag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Language Selector */}
                  {showLanguageSelector && (
                    <div className="relative group">
                      <button className="selector-dropdown flex items-center gap-2">
                        <span>🇸🇦</span>
                        <span>العربية</span>
                        <ChevronLeft className="w-3 h-3 rotate-90" />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-premium-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        {languages.map((language: { code: string; name: string; flag: string }) => (
                          <button key={language.code} className="w-full px-4 py-3 text-right hover:bg-[var(--color-surface-alt)] transition-colors flex items-center justify-end gap-3">
                            <span>{language.name}</span>
                            <span>{language.flag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Search Bar */}
              {variant === 'default' ? (
                <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-full max-w-[520px]">
                  <Search className="w-4 h-4 xl:w-5 xl:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={currentLang.search.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
                  />
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <Search className="w-5 h-5 text-[var(--color-text-primary)]" />
                </button>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-4">
                {variant === 'premium' && (
                  <button className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
                    <Heart className="w-5 h-5 text-[var(--color-text-primary)]" />
                  </button>
                )}
                
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingCart className={`w-5 h-5 sm:w-6 sm:h-6 ${variant === 'premium' ? 'text-[var(--color-text-primary)]' : 'text-gray-700'}`} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                
                <Link href="/dashboard/profile" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className={`w-5 h-5 sm:w-6 sm:h-6 ${variant === 'premium' ? 'text-[var(--color-text-primary)]' : 'text-gray-700'}`} />
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            {variant === 'default' && (
              <form onSubmit={handleSearch} className="lg:hidden mt-3 sm:mt-4 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={currentLang.search.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
                />
              </form>
            )}
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-3 sm:py-4">
              <div className="space-y-3 sm:space-y-4">
                <Link
                  href="/"
                  className="block font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {currentLang.nav.home}
                </Link>
                <Link
                  href="/products"
                  className="block font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {currentLang.nav.products}
                </Link>
                <Link
                  href="/about"
                  className="block font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {currentLang.nav.about}
                </Link>
                <Link
                  href="/contact"
                  className="block font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {currentLang.nav.contact}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal - Premium Variant */}
      {variant === 'premium' && isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl shadow-premium-lg w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'ابحث عن منتجات طبيعية فاخرة...' : 'Search for premium natural products...'}
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
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 text-right">
                  {locale === 'ar' ? 'عمليات البحث الشائعة' : 'Popular Searches'}
                </p>
                <div className="flex flex-wrap gap-2 justify-end">
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">
                    {locale === 'ar' ? 'زيت الأرغان' : 'Argan Oil'}
                  </span>
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">
                    {locale === 'ar' ? 'شاي الأعشاب' : 'Herbal Tea'}
                  </span>
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">
                    {locale === 'ar' ? 'العناية الطبيعية' : 'Natural Care'}
                  </span>
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">
                    {locale === 'ar' ? 'منتجات عضوية' : 'Organic Products'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
