"use client";

import Link from "next/link";
import Image from "next/image";
import { Leaf, Award, Users, Zap, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function AboutPage() {
  const { cartItemCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
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
              <Link href="/about" className="text-primary-600 font-semibold">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">اتصل بنا</Link>
            </nav>
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
            عن BioPara
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            رحلتنا لتوفير أفضل الأعشاب الطبية الطبيعية لصحتك وعافيتك
          </p>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/medical-herbs/lavender-herb.jpg"
              alt="عن المتجر"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-gray-900">من نحن</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              BioPara متخصص في بيع الأعشاب الطبية الطبيعية والمنتجات الصحية
              بجودة عالية. نؤمن بقوة الطبيعة وفوائدها الصحية الفعالة.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              كل منتج يتم اختياره بعناية من أفضل المصادر العالمية، ويخضع
              لفحوصات جودة صارمة. نحن ملتزمون بتقديم منتجات آمنة وفعالة
              لعملائنا.
            </p>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "رسالتنا",
              text: "توفير أعشاب طبية طبيعية عالية الجودة تساهم في تحسين صحة وعافية عملائنا بأسعار عادلة وخدمة متميزة.",
            },
            {
              title: "رؤيتنا",
              text: "أن نكون المتجر الأول والموثوق به لبيع الأعشاب الطبية والمنتجات الصحية الطبيعية.",
            },
            {
              title: "قيمنا",
              text: "الجودة والأمان والشفافية والصدق. نحن نضع ثقة عملائنا فوق كل شيء ونسعى لتقديم أفضل خدمة ممكنة.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: Leaf, label: "منتج", value: "50+" },
            { icon: Users, label: "عميل راضي", value: "5000+" },
            { icon: Award, label: "جودة مضمونة", value: "100%" },
            { icon: Zap, label: "سنوات خبرة", value: "5+" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-md text-center"
              >
                <Icon
                  size={40}
                  className="text-primary-600 mx-auto mb-4"
                />
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-primary-600 text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">
            ابدأ رحلتك الصحية اليوم
          </h2>
          <p className="text-lg text-primary-100 mb-6">
            اكتشف مجموعة واسعة من الأعشاب الطبية الطبيعية
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            استكشف المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
