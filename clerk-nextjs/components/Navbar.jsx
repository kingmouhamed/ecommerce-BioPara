"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from "@/components/Logo"; // تأكد أن اسم الملف مطابق تماماً

const Navbar = () => {
  const pathname = usePathname();

  // دالة مساعدة لتحديد هل الرابط نشط أم لا
  const isActive = (path) => pathname === path ? 'text-emerald-700 font-bold' : 'text-gray-600 hover:text-emerald-600';

  return (
    // جعلنا الـ nav مرناً (flex) لكي تترتب العناصر بجانب بعضها
    <nav className="navbar flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-100" dir="rtl">
      
      {/* --- 1. قسم اللوجو (سيكون على اليمين) --- */}
      <div className="logo-container">
        <Link href="/">
          {/* يمكنك التحكم في حجم اللوجو من هنا */}
          <Logo className="w-32 md:w-40 h-auto" /> 
        </Link>
      </div>

      {/* --- 2. قسم الروابط (سيكون في الوسط/اليسار) --- */}
      {/* أخفينا الروابط في الموبايل (hidden) وأظهرناها في الشاشات المتوسطة فما فوق (md:flex) */}
      <div className="hidden md:flex items-center gap-6 text-sm md:text-base">
        
        <Link href="/" className={isActive('/')}>
          الرئيسية
        </Link>
        
        <Link href="/products" className={isActive('/products')}>
          جميع المنتجات
        </Link>
        
        <Link href="/products?category=Visage" className={isActive('/products') && pathname.includes('Visage') ? 'active' : 'text-gray-600 hover:text-emerald-600'}>
          الأعشاب الطبية
        </Link>
        
        <Link href="/products?category=Corps" className={isActive('/products') && pathname.includes('Corps') ? 'active' : 'text-gray-600 hover:text-emerald-600'}>
          الجسم
        </Link>
        
        <Link href="/about" className={isActive('/about')}>
          عن المتجر
        </Link>
        
        <Link href="/brands" className={isActive('/brands')}>
          الماركات
        </Link>
        
        <Link href="/contact" className={isActive('/contact')}>
          اتصل بنا
        </Link>

      </div>

      {/* --- (اختياري) زر قائمة للموبايل --- */}
      <div className="md:hidden text-gray-600">
        {/* هنا يمكنك إضافة أيقونة القائمة لاحقاً */}
        ☰
      </div>

    </nav>
  );
};

export default Navbar;
