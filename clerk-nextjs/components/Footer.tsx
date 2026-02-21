'use client';

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-2xl text-primary-400">
              <Leaf size={28} />
              <span>BioParaa</span>
            </div>
            <p className="text-sm text-gray-400">
              متجرك الأول للأعشاب الطبية الطبيعية والمنتجات الصحية 100%
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary-400 transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/category" className="hover:text-primary-400 transition-colors">
                  الفئات
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  عن المتجر
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">السياسات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-400 transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-primary-400 transition-colors">
                  سياسة التوصيل
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary-400 transition-colors">
                  سياسة الاسترجاع
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">تواصل معنا</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-primary-400" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary-400" />
                <span>info@bioparaa.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary-400" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-full transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-full transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-full transition-colors">
                <Instagram size={20} />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-center text-sm text-gray-400">
              © 2024 BioParaa. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
