"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Send, Truck, Shield, RefreshCw, CreditCard } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: 'تصفح كل المنتجات', href: '/products' },
      { name: 'أحدث العروض', href: '/promotions' },
    ],
    company: [
      { name: 'من نحن', href: '/about' },
      { name: 'اتصل بنا', href: '/contact' },
      { name: 'الأسئلة الشائعة', href: '/faq' },
      { name: 'الاستشارات', href: '/consultation' },
    ],
    legal: [
      { name: 'شروط الاستخدام', href: '/terms' },
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'سياسة الإرجاع', href: '/returns' },
      { name: 'الشحن والتوصيل', href: '/delivery' },
    ],
    support: [
      { name: 'تتبع الطلبات', href: '/orders' },
      { name: 'الدعم الفني', href: '/contact' },
      { name: 'ضمان الجودة', href: '/guarantee' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/biopara' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/biopara' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/biopara' },
    { name: 'Youtube', icon: Youtube, href: 'https://youtube.com/biopara' },
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'مدى', icon: '💳' },
    { name: 'أبل باي', icon: '💳' },
  ];

  const shippingPartners = [
    { name: 'أرامكس', icon: '🚚' },
    { name: 'سعودي', icon: '✈️' },
    { name: 'DHL', icon: '📦' },
    { name: 'فيدكس', icon: '📦' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-emerald-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">اشترك في نشرتنا البريدية</h3>
            <p className="text-emerald-100 mb-6">احصل على أحدث العروض والمنتجات الجديدة</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">المنتجات</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الشركة</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">info@biopara.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">ساعات العمل</h4>
            <div className="space-y-2 text-gray-300">
              <p>من السبت إلى الخميس: 9 صباحاً - 9 مساءً</p>
              <p>الجمعة: 2 ظهراً - 9 مساءً</p>
              <p>الأحد: مغلق</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-800">
          <div className="text-center">
            <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h5 className="font-semibold mb-2">شحن سريع</h5>
            <p className="text-gray-400 text-sm">توصيل خلال 24-48 ساعة</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h5 className="font-semibold mb-2">ضمان الجودة</h5>
            <p className="text-gray-400 text-sm">منتجات أصلية 100%</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h5 className="font-semibold mb-2">استرجاع سهل</h5>
            <p className="text-gray-400 text-sm">استرجاع خلال 30 يوم</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-lg font-semibold mb-4 text-center">طرق الدفع الآمنة</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method) => (
              <div key={method.name} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <span className="text-2xl">{method.icon}</span>
                <span className="text-sm text-gray-300 mr-2">{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Partners */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4 text-center">شركاء الشحن</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {shippingPartners.map((partner) => (
              <div key={partner.name} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <span className="text-xl mr-2">{partner.icon}</span>
                <span className="text-sm text-gray-300">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-lg font-semibold">تابعنا على</h4>
            <div className="flex space-x-4 space-x-reverse">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} BioPara. جميع الحقوق محفوظة.
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                شروط الاستخدام
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
