"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const categories = [
    { name: 'الأعشاب الطبية', href: '/products?category=الأعشاب الطبية' },
    { name: 'Parapharmacie', href: '/products?category=Parapharmacie' }
  ];

  const brands = [
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

  return (
    <nav id="navbar" className="bg-white sticky top-0 z-40 transition-shadow duration-300" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="border-b border-gray-100 py-2">
          <div className="flex justify-between items-center">
            <div className="hidden sm:flex items-center gap-2 text-gray-600">
              <span className="text-xs sm:text-sm">📞 +212 673020264</span>
              <span className="text-xs sm:text-sm">✉️ biopara@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/favorites" className="text-gray-600 hover:text-emerald-600 transition-colors text-xs sm:text-sm">
                المفضلة
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-emerald-600 transition-colors text-xs sm:text-sm whitespace-nowrap">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="BioPara Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">BioPara</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 sm:gap-8">
              <Link
                href="/"
                className={`font-medium transition-colors ${
                  pathname === '/' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                الرئيسية
              </Link>
              
              {/* Categories Dropdown */}
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
                  المنتجات
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
                    {categories.map((category, index) => (
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
                        عرض جميع المنتجات
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Brands Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => {
                    setTimeout(() => setIsBrandsOpen(true), 150);
                  }}
                  onMouseLeave={() => {
                    setTimeout(() => setIsBrandsOpen(false), 200);
                  }}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    pathname === '/brands' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  الماركات
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isBrandsOpen && (
                  <div
                    onMouseEnter={() => setIsBrandsOpen(true)}
                    onMouseLeave={() => {
                      setTimeout(() => setIsBrandsOpen(false), 200);
                    }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 max-h-96 overflow-y-auto z-50 transition-all duration-300 ease-in-out transform origin-top"
                  >
                    {brands.map((brand, index) => (
                      <Link
                        key={index}
                        href={brand.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        {brand.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        href="/brands"
                        className="block px-4 py-2 text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
                      >
                        عرض جميع الماركات
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/promotions"
                className={`font-medium transition-colors ${
                  pathname === '/promotions' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                العروض
              </Link>
              <Link
                href="/about"
                className={`font-medium transition-colors ${
                  pathname === '/about' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                من نحن
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-full max-w-[520px]">
              <Search className="w-4 h-4 xl:w-5 xl:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              <Link href="/dashboard/profile" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
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
          <form onSubmit={handleSearch} className="lg:hidden mt-3 sm:mt-4 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </form>
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
                الرئيسية
              </Link>
              
              <div>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-1 font-medium text-gray-700 hover:text-emerald-600 transition-colors w-full"
                >
                  المنتجات
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoriesOpen && (
                  <div className="mt-2 space-y-2 pr-4">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        href={category.href}
                        className="block text-gray-600 hover:text-emerald-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      href="/products"
                      className="block text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      عرض جميع المنتجات
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                  className="flex items-center gap-1 font-medium text-gray-700 hover:text-emerald-600 transition-colors w-full"
                >
                  الماركات
                  <ChevronDown className={`w-4 h-4 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isBrandsOpen && (
                  <div className="mt-2 space-y-2 pr-4 max-h-48 overflow-y-auto">
                    {brands.map((brand, index) => (
                      <Link
                        key={index}
                        href={brand.href}
                        className="block text-gray-600 hover:text-emerald-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {brand.name}
                      </Link>
                    ))}
                    <Link
                      href="/brands"
                      className="block text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      عرض جميع الماركات
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/promotions"
                className="block font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                العروض
              </Link>
              <Link
                href="/about"
                className="block font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
