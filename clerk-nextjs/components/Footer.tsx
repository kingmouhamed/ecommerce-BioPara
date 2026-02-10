"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/images/logo.png" 
                alt="BioPara Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold">BioPara</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              خبيرك في المنتجات شبه الصيدلية والعلاج بالنباتات في المغرب. نقدم أفضل المنتجات الطبيعية والعلاجية.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">من نحن</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-emerald-400 transition-colors">المنتجات</Link></li>
              <li><Link href="/brands" className="text-gray-400 hover:text-emerald-400 transition-colors">الماركات</Link></li>
              <li><Link href="/promotions" className="text-gray-400 hover:text-emerald-400 transition-colors">العروض</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">خدمة العملاء</h3>
            <ul className="space-y-2">
              <li><Link href="/delivery" className="text-gray-400 hover:text-emerald-400 transition-colors">التوصيل والشحن</Link></li>
              <li><Link href="/payment" className="text-gray-400 hover:text-emerald-400 transition-colors">طرق الدفع</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="/auth/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/dashboard/favorites" className="text-gray-400 hover:text-emerald-400 transition-colors">المفضلة</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">+212 5XX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">info@biopara.ma</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">الدار البيضاء، المغرب</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">9:00 - 18:00 (السبت - الخميس)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 BioPara. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="BioPara" className="w-5 h-5" />
              <span className="text-gray-400 text-sm">صنع بـ ❤️ في المغرب</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
