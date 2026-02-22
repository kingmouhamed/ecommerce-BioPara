"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const faqs = [
  {
    q: "هل المنتجات طبيعية 100%؟",
    a: "نعم، جميع منتجاتنا طبيعية 100% ومعتمدة عضوية. نحن نختار المنتجات بعناية من أفضل المصادر.",
  },
  {
    q: "ما هي مدة التوصيل؟",
    a: "مدة التوصيل تتراوح بين 24 إلى 48 ساعة للمدن الكبرى، و3 إلى 5 أيام للمناطق النائية.",
  },
  {
    q: "هل يوجد شحن مجاني؟",
    a: "نعم، الشحن مجاني لجميع الطلبات التي تتجاوز 300 درهم.",
  },
  {
    q: "هل يمكنني إرجاع المنتج؟",
    a: "نعم، يمكنك إرجاع المنتج خلال 7 أيام من تاريخ الاستلام بشرط أن يكون في حالته الأصلية.",
  },
  {
    q: "ما هي طرق الدفع المتاحة؟",
    a: "نقبل الدفع عند الاستلام والبطاقات الائتمانية والتحويل البنكي.",
  },
  {
    q: "هل يمكنني تتبع طلبي؟",
    a: "نعم، بعد شحن طلبك ستتلقى رقم تتبع عبر البريد الإلكتروني.",
  },
];

export default function FaqPage() {
  const { cartItemCount } = useCart();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">الأسئلة الشائعة</h1>
          <p className="text-lg text-gray-600">إجابات على أكثر الأسئلة شيوعا حول منتجاتنا وخدماتنا</p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-right"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
