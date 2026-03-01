"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Menu, X, ChevronDown, UserSquare2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '../ui/Toast';
import { cn } from '@/utils/helpers';

interface HeaderProps {
  className?: string;
}

function Header({ className = "" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const router = useRouter();
  const { cartItemCount } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'العسل الطبيعي', href: '/categories/natural-honey', icon: '🍯' },
    { name: 'الأعشاب الطبية', href: '/categories/medicinal-herbs', icon: '🌿' },
    { name: 'الزيوت العطرية', href: '/categories/essential-oils', icon: '🛢️' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    } else {
      addToast({
        type: 'warning',
        title: 'الرجاء إدخال كلمة البحث',
        message: 'يجب إدخال نص للبحث عن المنتجات'
      });
    }
  };

  const handleCategoryClick = (category: typeof categories[0]) => {
    setIsMenuOpen(false);
    setCategoriesOpen(false);
    router.push(category.href);
  };

  return (
    <>
      {/* Main Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" : "bg-white shadow-sm",
        className
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <Image
                src="/images/logo.png"
                alt="BioPara"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-600 block">BioPara</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  title="Product categories"
                  className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  <span>المنتجات</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", categoriesOpen && "rotate-180")} />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    {categories.map((category) => (
                      <button
                        key={category.href}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center justify-end space-x-3 space-x-reverse"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-gray-700">{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/about" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                من نحن
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                اتصل بنا
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="ابحث عن منتجات..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-full focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Search Toggle (Mobile) */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                title="Search"
                className="md:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* View Toggle */}
              <button title="Grid view" className="hidden sm:block p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Grid className="w-5 h-5" />
              </button>

              {/* Filter Toggle */}
              <button title="Filters" className="hidden sm:block p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Filter className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Auth: Clerk Integration */}
              <div className="flex items-center">
                <SignedIn>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                      <UserSquare2 className="w-5 h-5" />
                      <span className="hidden sm:inline">دخول</span>
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Menu"
                className="lg:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar (Expanded) */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4">
              <div className="container mx-auto">
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن منتجات..."
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">القائمة</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  title="Close menu"
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">المنتجات</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.href}
                      onClick={() => handleCategoryClick(category)}
                      className="w-full px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center justify-end space-x-3 space-x-reverse"
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-gray-700">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-emerald-50 transition-colors text-gray-700"
                >
                  من نحن
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-emerald-50 transition-colors text-gray-700"
                >
                  اتصل بنا
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-emerald-50 transition-colors text-gray-700"
                >
                  الأسئلة الشائعة
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
}

export default Header;
