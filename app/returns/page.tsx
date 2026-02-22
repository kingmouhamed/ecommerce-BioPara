"use client";

import Link from "next/link";
import { Leaf, ShoppingCart, RefreshCw, Shield, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function ReturnsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-balance">سياسة الإرجاع والاستبدال</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: RefreshCw, title: "إرجاع مجاني", desc: "إرجاع مجاني خلال 7 أيام من تاريخ الاستلام" },
            { icon: Shield, title: "ضمان الجودة", desc: "نضمن جودة جميع منتجاتنا الطبيعية" },
            { icon: Clock, title: "استرداد سريع", desc: "استرداد المبلغ خلال 3 إلى 5 أيام عمل" },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">شروط الإرجاع</h2>
          <ul className="flex flex-col gap-3 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
              يجب أن يكون المنتج في حالته الأصلية ولم يتم فتحه أو استخدامه
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
              يجب تقديم طلب الإرجاع خلال 7 أيام من تاريخ الاستلام
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
              يتحمل العميل تكاليف شحن الإرجاع
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
              يتم استرداد المبلغ بنفس طريقة الدفع المستخدمة
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
