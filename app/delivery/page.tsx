"use client";

import Link from "next/link";
import { Leaf, Truck, Clock, MapPin, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function DeliveryPage() {
  const { cartItemCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              BioPara
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">المنتجات</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">اتصل بنا</Link>
            </nav>
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary-600 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">{cartItemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-balance">سياسة التوصيل</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Truck, title: "توصيل سريع", desc: "نوصل لجميع أنحاء المغرب خلال 24 إلى 48 ساعة" },
            { icon: Clock, title: "شحن مجاني", desc: "شحن مجاني للطلبات فوق 300 درهم" },
            { icon: MapPin, title: "تغطية شاملة", desc: "نغطي جميع مدن وقرى المملكة المغربية" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md text-center">
                <Icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تفاصيل التوصيل</h2>
          <div className="flex flex-col gap-4 text-gray-700 leading-relaxed">
            <p>نحن نتعاون مع أفضل شركات الشحن والتوصيل في المغرب لضمان وصول طلبك بأمان وفي الوقت المحدد.</p>
            <p>مدة التوصيل تتراوح بين 24 إلى 48 ساعة للمدن الكبرى، و3 إلى 5 أيام للمناطق النائية.</p>
            <p>يمكنك تتبع طلبك من خلال رقم التتبع الذي سيرسل إليك عبر البريد الإلكتروني.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
