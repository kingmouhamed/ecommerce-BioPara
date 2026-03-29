"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Truck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-6 border-t border-gray-800" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

          {/* Column 1: BioPara Brand */}
          <div className="flex flex-col items-start lg:col-span-1">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 bg-white px-3 py-2 rounded-xl">
              <Image
                src="/images/logo.png"
                alt="BioPara"
                width={110}
                height={35}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              متجر متخصص في المنتجات الطبيعية والأعشاب والزيوت والمكملات الغذائية عالية الجودة
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:pr-8">
            <h3 className="text-lg font-bold mb-6 text-white">روابط سريعة</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">من نحن</Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-emerald-400 transition-colors">المنتجات</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-emerald-400 transition-colors">المدونة</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">اتصل بنا</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">خدمة العملاء</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/track-order" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2 w-fit">
                  <Truck className="w-4 h-4" />
                  تتبع طلبي
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">الشحن والتوصيل</Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">سياسة الإرجاع</Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">شروط الاستخدام</Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">سياسة الخصوصية</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:pr-8">
            <h3 className="text-lg font-bold mb-6 text-white">تواصل معنا</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 shrink-0" />
                <span dir="ltr" className="inline-block text-right w-fit">06 73 02 02 64</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="mt-0.5">info@biopara.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="mt-0.5">المغرب - الدار البيضاء</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/60 pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-6 uppercase">
          <p className="text-gray-400 text-sm">
            © {currentYear} BioPara. جميع الحقوق محفوظة.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm ml-2">وسائل الدفع:</span>
            <div className="flex gap-2.5">
              <div className="bg-white text-gray-900 text-[11px] font-black px-3.5 py-1.5 rounded tracking-wide">VISA</div>
              <div className="bg-white text-gray-900 text-[11px] font-black px-3.5 py-1.5 rounded tracking-wide">MC</div>
              <div className="bg-white text-gray-900 text-[11px] font-black px-3.5 py-1.5 rounded tracking-wide">COD</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
