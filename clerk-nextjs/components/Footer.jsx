"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Send, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Section: Brand info, Newsletter, and Contact */}
        <div className="grid md:grid-cols-3 gap-12 mb-10 border-b border-gray-700 pb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/parapharma-logo.svg" alt="BioPara Logo" width={50} height={50} className="bg-white rounded-full p-1" />
              <h1 className="text-3xl font-bold text-white">BioPara</h1>
            </Link>
            <p className="text-gray-400 mb-6">
              متجركم الأول للمنتجات الطبيعية والعضوية في المغرب. نقدم لكم أفضل المنتجات لصحة وجمال مستدام.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={24} /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">اشترك في نشرتنا البريدية</h3>
            <p className="text-gray-400 mb-4">احصل على آخر العروض والتخفيضات مباشرة على بريدك الإلكتروني.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="w-full px-4 py-2 text-gray-800 bg-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-r-md hover:bg-green-700">
                <Send size={20} />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 text-green-400 flex-shrink-0" />
                <span>شارع النصر، رقم 123، الدار البيضاء، المغرب</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="mt-1 text-green-400 flex-shrink-0" />
                <a href="mailto:contact@biopara.ma" className="hover:text-white">contact@biopara.ma</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="mt-1 text-green-400 flex-shrink-0" />
                <a href="tel:+212673020264" className="hover:text-white">+212 673 02 02 64</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">منتجاتنا</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-white">جميع المنتجات</Link></li>
              <li><Link href="/products?promo=true" className="text-gray-400 hover:text-white">العروض</Link></li>
              <li><Link href="/products?new=true" className="text-gray-400 hover:text-white">الجديد</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">من نحن</Link></li>
              <li><Link href="/delivery" className="text-gray-400 hover:text-white">التوصيل</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">شروط الاستخدام</Link></li>
              <li><Link href="/payment" className="text-gray-400 hover:text-white">الدفع الآمن</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">حسابي</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-gray-400 hover:text-white">تسجيل الدخول</Link></li>
              <li><Link href="/cart" className="text-gray-400 hover:text-white">سلتي</Link></li>
              <li><Link href="/favorites" className="text-gray-400 hover:text-white">المفضلة</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">وسائل الدفع</h3>
            <div className="flex space-x-2">
              {/* Replace with actual payment icons */}
              <div className="w-12 h-8 bg-gray-600 rounded-md flex items-center justify-center text-xs">Visa</div>
              <div className="w-12 h-8 bg-gray-600 rounded-md flex items-center justify-center text-xs">Mastercard</div>
              <div className="w-12 h-8 bg-gray-600 rounded-md flex items-center justify-center text-xs">CMI</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 mt-12 border-t border-gray-700 pt-8">
          <p>&copy; {new Date().getFullYear()} BioPara. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
