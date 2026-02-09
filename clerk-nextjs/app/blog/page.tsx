"use client";

import React, { useState } from "react";
import { Search, Calendar, User, Clock, ChevronRight } from "lucide-react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "أفضل 10 زيوت طبيعية للعناية بالبشرة",
      excerpt: "اكتشف أفضل الزيوت الطبيعية التي يمكن أن تحسن من جودة بشرتك بشكل طبيعي وآمن.",
      category: "العناية بالبشرة",
      author: "د. فاطمة العلوي",
      date: "2026-01-15",
      readTime: "5 دقائق",
      image: "/blog/oils.jpg",
      tags: ["زيوت طبيعية", "بشرة", "عناية"]
    },
    {
      id: 2,
      title: "دليلك الكامل لاستخدام الأعشاب الطبية",
      excerpt: "كل ما تحتاج لمعرفته عن الأعشاب الطبية، فوائدها، وكيفية استخدامها بأمان.",
      category: "الأعشاب الطبية",
      author: "أحمد الرحماني",
      date: "2026-01-10",
      readTime: "8 دقائق",
      image: "/blog/herbs.jpg",
      tags: ["أعشاب", "طب طبيعي", "صحة"]
    },
    {
      id: 3,
      title: "فوائد فيتامين C للبشرة والشعر",
      excerpt: "كيف يمكن لفيتامين C أن يحسن من مظهر بشرتك وشعرك بشكل ملحوظ.",
      category: "الفيتامينات",
      author: "د. مريم السعيد",
      date: "2026-01-08",
      readTime: "6 دقائق",
      image: "/blog/vitamin-c.jpg",
      tags: ["فيتامينات", "بشرة", "شعر"]
    },
    {
      id: 4,
      title: "كيفية اختيار واقي الشمس المناسب لك",
      excerpt: "نصائح مهمة لاختيار واقي الشمس المناسب لنوع بشرتك وحمايتها من أشعة الشمس.",
      category: "الحماية من الشمس",
      author: "خديمة بنعلي",
      date: "2026-01-05",
      readTime: "4 دقائق",
      image: "/blog/sunscreen.jpg",
      tags: ["شمس", "حماية", "بشرة"]
    },
    {
      id: 5,
      title: "العناية بالبشرة في فصل الشتاء",
      excerpt: "نصائح هامة للحفاظ على بشرتك صحية ورطبة خلال فصل الشتاء البارد.",
      category: "العناية بالبشرة",
      author: "د. فاطمة العلوي",
      date: "2026-01-03",
      readTime: "7 دقائق",
      image: "/blog/winter.jpg",
      tags: ["شتاء", "بشرة", "عناية"]
    },
    {
      id: 6,
      title: "فوائد زيت الأرغان للجسم والشعر",
      excerpt: "اكتشف الفوائد المذهلة لزيت الأرغان المغربي الأصلي وكيفية استخدامه.",
      category: "الزيوت الطبيعية",
      author: "أحمد الرحماني",
      date: "2026-01-01",
      readTime: "5 دقائق",
      image: "/blog/argan.jpg",
      tags: ["أرغان", "زيوت", "مغرب"]
    }
  ];

  const categories = ["all", "العناية بالبشرة", "الأعشاب الطبية", "الفيتامينات", "الحماية من الشمس", "الزيوت الطبيعية"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">مدونة BioPara</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            نصائح ومقالات متخصصة في العناية بالصحة والجمال باستخدام المنتجات الطبيعية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "جميع الفئات" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition group">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('ar-MA')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-emerald-700 transition">
                  {post.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Author and Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                  <button className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium text-sm transition">
                    اقرأ المزيد
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">لم يتم العثور على مقالات</h3>
            <p className="text-gray-600">جرب تغيير كلمات البحث أو الفئة</p>
          </div>
        )}

        {/* Newsletter */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">اشترك في نشرتنا الإخبارية</h3>
          <p className="text-emerald-700 mb-6">
            احصل على أحدث المقالات والنصائح حول العناية الطبيعية مباشرة في بريدك الإلكتروني
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              dir="rtl"
            />
            <button className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition">
              اشترك
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
