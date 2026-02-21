'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Leaf, User } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  cartCount?: number;
  isAuthenticated?: boolean;
}

export default function Navigation({ cartCount = 0, isAuthenticated = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary-600">
            <Leaf size={28} />
            <span>BioParaa</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              المنتجات
            </Link>
            <Link href="/category" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              الفئات
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              عن المتجر
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              اتصل بنا
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search size={20} className="text-gray-700" />
            </button>

            {isAuthenticated ? (
              <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full">
                <User size={20} className="text-gray-700" />
              </Link>
            ) : (
              <Link href="/sign-in" className="p-2 hover:bg-gray-100 rounded-full">
                <User size={20} className="text-gray-700" />
              </Link>
            )}

            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? (
                <X size={20} className="text-gray-700" />
              ) : (
                <Menu size={20} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <Link
              href="/products"
              className="block text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              المنتجات
            </Link>
            <Link
              href="/category"
              className="block text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              الفئات
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              عن المتجر
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              اتصل بنا
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
