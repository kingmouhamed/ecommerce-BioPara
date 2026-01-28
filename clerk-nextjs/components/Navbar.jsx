"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className={pathname === '/' ? 'active' : ''}>الرئيسية</Link>
      <Link href="/products" className={pathname === '/products' ? 'active' : ''}>جميع المنتجات</Link>
      <Link href="/products?category=Visage" className={pathname === '/products' ? 'active' : ''}>الاعشاب الطبية</Link>
      <Link href="/products?category=Corps" className={pathname === '/products' ? 'active' : ''}>الجسم</Link>
      <Link href="/about" className={pathname === '/about' ? 'active' : ''}>عن المتجر</Link>
      <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>اتصل بنا</Link>
    </nav>
  );
};

export default Navbar;
