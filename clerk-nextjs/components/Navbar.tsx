"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  User,
  Heart,
  Phone,
  Menu,
  X,
  ChevronRight,
  Droplets,
  Leaf,
} from "lucide-react";

// تصنيفات البارافارماسيا
const paraCategories = [
  "العناية بالوجه", "العناية بالجسم", "العناية بالشعر", "النظافة الشخصية", "الأم والطفل", "الحماية من الشمس", "رجال"
];

// تصنيفات الأعشاب والبيو
const herbalCategories = [
  "الزيوت العطرية", "الأعشاب والمشروبات", "العسل ومنتجات النحل", "المكملات الغذائية", "مستحضرات التجميل العضوية"
];

const TopBar = () => (
  <div className="bg-gray-100 text-gray-600 text-xs py-2 px-4 hidden md:flex justify-between items-center border-b" dir="rtl">
    <div className="flex gap-4">
      <Link href="/routes" className="hover:text-emerald-700">خريطة الموقع</Link>
      <span className="flex items-center gap-1">
        <Phone size={14} /> +212 600 000 000
      </span>
    </div>
    <div className="flex gap-4">
      <span>شحن مجاني للطلبات فوق 300 درهم</span>
      <Link href="/contact" className="hover:text-emerald-700">اتصل بنا</Link>
    </div>
  </div>
);

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" onClick={onClose} className="text-xl font-bold text-emerald-700">
            BioPara.ma
          </Link>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mt-6">
          {/* قسم البارا في الموبايل */}
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 border-b pb-2">
            <Droplets size={18} className="text-blue-500"/> Parapharmacie
          </h3>
          <ul className="space-y-1 text-sm text-gray-700 mb-6 pl-4">
            {paraCategories.map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} onClick={onClose} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  {cat} <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>

          {/* قسم الأعشاب في الموبايل */}
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 border-b pb-2">
             <Leaf size={18} className="text-green-600"/> Herboristerie & Bio
          </h3>
          <ul className="space-y-1 text-sm text-gray-700 pl-4">
            {herbalCategories.map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} onClick={onClose} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  {cat} <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface NavbarProps {
  onOpenMobileMenu: () => void;
  cartItemCount: number;
}

function Navbar({ onOpenMobileMenu, cartItemCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <TopBar />

      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Left: Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <Image src="/logo.svg" alt="BioPara Logo" width={150} height={60} priority />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex relative">
          <input
            type="text"
            placeholder="ابحث عن: فيتامين سي، زيت الأركان..."
            className="w-full border-2 border-emerald-600 rounded-r-md py-2.5 px-4 focus:outline-none text-right"
          />
          <button className="bg-emerald-700 text-white px-6 rounded-l-md font-medium hover:bg-emerald-800 transition">
            بحث
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-600">
          <Link href="/auth/login" className="flex flex-col items-center hover:text-emerald-700 group">
            <User size={24} />
            <span className="text-xs mt-1 group-hover:underline">حسابي</span>
          </Link>

          <Link href="/dashboard/favorites" className="flex flex-col items-center hover:text-emerald-700 group">
            <Heart size={24} />
            <span className="text-xs mt-1 group-hover:underline">المفضلة</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center hover:text-emerald-700 group relative">
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            </div>
            <span className="text-xs mt-1 group-hover:underline">السلة</span>
          </Link>
        </div>
      </div>

      {/* Navigation Bar - مقسمة بوضوح */}
      <nav className="bg-emerald-700 text-white hidden md:block" dir="rtl">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm font-medium py-3">
            <li>
              <Link href="/products" className="flex items-center gap-2 hover:text-emerald-200 font-bold">
                <Menu size={18} /> كل الأقسام
              </Link>
            </li>
            
            {/* قسم البارافارماسيا */}
            <li className="flex items-center gap-1 opacity-80 px-2 border-r border-emerald-600 pr-4">
                <Droplets size={16} className="text-emerald-300"/> <span className="text-xs uppercase tracking-wider text-emerald-200">شبه صيدلية</span>
            </li>
            {paraCategories.slice(0, 3).map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} className="hover:text-emerald-200 uppercase tracking-wide">
                  {cat}
                </Link>
              </li>
            ))}

             {/* قسم الأعشاب */}
            <li className="flex items-center gap-1 opacity-80 px-2 border-r border-emerald-600 pr-4">
                <Leaf size={16} className="text-green-300"/> <span className="text-xs uppercase tracking-wider text-green-200">الأعشاب</span>
            </li>
            {herbalCategories.slice(0, 2).map((cat) => (
               <li key={cat}>
               <Link href={`/category/${cat.toLowerCase()}`} className="hover:text-emerald-200 uppercase tracking-wide">
                 {cat}
               </Link>
             </li>
            ))}

            <li className="mr-auto">
              <Link href="/promotions" className="text-orange-300 font-bold hover:text-white">العروض</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
export { MobileMenu };
