"use client";

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';
import { cn } from '@/utils/helpers';
import SearchBar from '../ui/SearchBar';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المكملات الغذائية', href: '/category/supplements' },
    { name: 'الأعشاب الطبية', href: '/category/herbs' },
    { name: 'الزيوت الطبية', href: '/category/oils' },
    { name: 'من نحن', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white shadow-sm",
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
            <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search */}
              <SearchBar />

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Account */}
              <Link href="/products/profil" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن منتجات..."
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
