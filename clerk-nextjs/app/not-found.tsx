import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, AlertCircle, Home, MessageCircle, ArrowRight } from 'lucide-react';
import BestSellers from '@/components/sections/BestSellers';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata = {
  title: 'الصفحة غير موجودة | BioPara',
  description: 'عذراً، الصفحة التي تبحث عنها غير موجودة.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  const blogArticles = getAllBlogPosts().slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 404 Header Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-32 h-32 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-8 relative">
            <AlertCircle className="w-16 h-16 text-emerald-600 relative z-10" />
            <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20"></div>
          </div>

          <h1 className="text-7xl font-black text-gray-900 mb-4 tracking-tighter">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">عذراً، هذه الصفحة غير متوفرة!</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            قد يكون الرابط الذي اتبعته قديماً، أو ربما تم نقل الصفحة أو حذفها.
            لكن لا تقلق، متجرنا يعج بالمنتجات الطبيعية والمقالات المفيدة.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto justify-center"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>

            <Link
              href="/products"
              className="flex items-center gap-2 bg-white text-emerald-700 border-2 border-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-md w-full sm:w-auto justify-center"
            >
              <Search className="w-5 h-5" />
              تصفح المنتجات
            </Link>

            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all shadow-md w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>

      {/* Suggested Products Divider */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">قد يعجبك أيضاً</h3>
            <p className="text-gray-600">اكتشف أفضل منتجاتنا مبيعاً</p>
          </div>
        </div>
      </div>

      {/* Included BestSellers UI Component directly */}
      <div className="bg-white pb-12">
        <BestSellers />
      </div>

      {/* Suggested Blog Articles (Using centralized lib) */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">أحدث المقالات الصحية</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.map((article) => (
              <Link href={`/blog/${article.id}`} key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all block">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {article.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-emerald-600 font-medium text-sm group-hover:text-emerald-700">
                    اقرأ المزيد
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
