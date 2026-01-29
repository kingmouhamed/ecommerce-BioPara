"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Heart, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();
  const cartContext = useCart();
  
  if (!cartContext) {
    return null;
  }
  const { cartItemCount, setIsCartOpen } = cartContext;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Brand Section */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/parapharma-logo.svg" alt="BioPara Logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold text-green-700 hidden sm:block">BioPara</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 px-4 lg:px-12">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="البحث عن منتج، علامة تجارية..."
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={22} />
              </button>
            </form>
          </div>

          {/* Header Actions */}
          <div className="hidden md:flex items-center space-x-5 text-gray-600">
            {user ? (
              <>
                <span className="text-sm">{user.email}</span>
                <button onClick={signOut} className="hover:text-green-700">تسجيل الخروج</button>
              </>
            ) : (
              <Link href="/login" className="hover:text-green-700 flex items-center"><User size={24} /><span className="ml-1">الدخول</span></Link>
            )}
            <Link href="/favorites" className="hover:text-green-700"><Heart size={24} /></Link>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-green-700">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-white text-xs font-bold border-2 border-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-green-700 text-white ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 py-2">
            <li><Link href="/" className="block py-2 px-3">الرئيسية</Link></li>
            <li><Link href="/products" className="block py-2 px-3">جميع المنتجات</Link></li>
            <li><Link href="/products?category=Visage" className="block py-2 px-3">الاعشاب الطبية</Link></li>
            <li><Link href="/products?category=Parapharmacie" className="block py-2 px-3">Parapharmacie</Link></li>
            <li><Link href="/about" className="block py-2 px-3">من نحن</Link></li>
            <li><Link href="/contact" className="block py-2 px-3">اتصل بنا</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;