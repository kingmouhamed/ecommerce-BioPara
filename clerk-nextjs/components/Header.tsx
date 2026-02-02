"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Heart, Menu, Phone, Mail, MapPin } from 'lucide-react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { cartItemCount, setIsCartOpen } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/products', label: 'جميع المنتجات' },
    { href: '/products?category=الأعشاب الطبية', label: 'الأعشاب الطبية' },
    { href: '/products?category=Parapharmacie', label: 'الصيدلية' },
    { href: '/about', label: 'من نحن' },
    { href: '/contact', label: 'اتصل بنا' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-700 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+212673020264" className="flex items-center gap-1 hover:text-yellow-300">
              <Phone size={16} />
              <span>+212 673 02 02 64</span>
            </a>
            <a href="mailto:contact@biopara.ma" className="hidden md:flex items-center gap-1 hover:text-yellow-300">
              <Mail size={16} />
              <span>contact@biopara.ma</span>
            </a>
          </div>
          <div className="text-center">
            <p className="font-semibold">توصيل مجاني للطلبات فوق 500 درهم</p>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <MapPin size={16} />
            <span>المغرب</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Brand Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/parapharma-logo.svg" alt="BioPara Logo" width={50} height={50} />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 px-4 lg:px-8">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="ابحث عن منتج، ماركة..."
                className="w-full py-2.5 pl-12 pr-4 text-gray-800 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700">
                <Search size={24} />
              </button>
            </form>
          </div>

          {/* Header Actions */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700">
            {user ? (
              <SignOutButton>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">مرحباً, {user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]}</span>
                  <button className="text-sm text-red-600 hover:text-red-800 font-medium">خروج</button>
                </div>
              </SignOutButton>
            ) : (
              <Link href="/login" className="hover:text-green-700 flex items-center gap-1">
                <User size={24} />
                <span className="font-semibold">الدخول</span>
              </Link>
            )}
            <Link href="/favorites" className="relative hover:text-green-700">
              <Heart size={24} />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-green-700">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2.5 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-white text-xs font-bold border-2 border-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              <Menu size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-white border-t border-gray-200 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block py-2 px-3 text-gray-600 font-semibold hover:text-green-700 transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;