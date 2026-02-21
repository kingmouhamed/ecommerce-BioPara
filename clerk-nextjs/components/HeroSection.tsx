'use client';

import Link from 'next/link';
import { ShoppingCart, Leaf } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="w-full bg-gradient-to-b from-primary-500 to-primary-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-right">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-white">BioParaa</h1>
              <p className="text-xl text-green-100">الأعشاب الطبية الطبيعية 100%</p>
            </div>

            <p className="text-lg text-green-50 max-w-xl mx-auto md:mx-0">
              اكتشف قوة الطبيعة مع أفضل الأعشاب والنباتات الطبية المختارة بعناية. منتجات طبيعية خالصة لصحتك وعافيتك.
            </p>

            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                href="/products"
                className="flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                <ShoppingCart size={20} />
                تسوق الآن
              </Link>

              <Link
                href="/category"
                className="flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary-600 transition-all"
              >
                <Leaf size={20} />
                الفئات
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="https://images.pexels.com/photos/3962642/pexels-photo-3962642.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="أعشاب طبية"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
