'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft, BookOpen } from 'lucide-react';

const articles = [
    {
        id: 1,
        title: 'أقوى 10 أعشاب مغربية لتقوية المناعة',
        excerpt: 'اكتشف أسرار الطب العشبي المغربي العريق لتعزيز دفاعاتك الطبيعية ضد الأمراض بطرق علمية ثابتة.',
        image: '/images/medicinal-herbs/ginger-herb.jpg',
        category: 'المناعة',
        categoryColor: 'bg-green-100 text-green-700',
        readTime: 8,
        date: '5 مارس 2026',
        slug: 'moroccan-immunity-herbs',
        featured: true,
    },
    {
        id: 2,
        title: 'الشفاء الطبيعي: دليلك الكامل للأعشاب الطبية',
        excerpt: 'كيف تستخدم النباتات الطبية باحترافية لعلاج الأمراض الشائعة والحفاظ على الصحة العامة.',
        image: '/images/medicinal-herbs/camomile-herb.jpg',
        category: 'صحة عامة',
        categoryColor: 'bg-blue-100 text-blue-700',
        readTime: 12,
        date: '1 مارس 2026',
        slug: 'natural-healing-herbs',
        featured: false,
    },
    {
        id: 3,
        title: 'كيف تستخدم النباتات الطبية بأمان؟',
        excerpt: 'الجرعات الصحيحة، التحذيرات والتفاعلات الدوائية لضمان الاستخدام الأمثل للأعشاب.',
        image: '/images/herbal tea/herb-tea-2.jpg',
        category: 'نصائح',
        categoryColor: 'bg-amber-100 text-amber-700',
        readTime: 6,
        date: '25 فبراير 2026',
        slug: 'safe-medicinal-plants',
        featured: false,
    },
];

export default function BlogSection() {
    return (
        <section className="py-20 bg-white" id="blog">
            <div className="container mx-auto px-4" dir="rtl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-4">
                    <div>
                        <span className="inline-block bg-purple-100 text-purple-700 text-sm font-bold px-4 py-1.5 rounded-full mb-3">
                            🎓 التعليم الصحي
                        </span>
                        <h2 className="text-4xl font-black text-gray-900">دليل الأعشاب</h2>
                        <p className="text-gray-500 mt-2">مقالات علمية موثوقة حول الطب العشبي</p>
                    </div>
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all whitespace-nowrap shrink-0"
                    >
                        <BookOpen className="w-4 h-4" />
                        جميع المقالات
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Featured article */}
                    <article className="lg:col-span-2 group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="relative h-72 overflow-hidden">
                            <Image
                                src={articles[0].image}
                                alt={articles[0].title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 66vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute top-4 right-4">
                                <span className="bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                                    ⭐ مقال مميز
                                </span>
                            </div>
                            <div className="absolute bottom-4 right-4 left-4">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${articles[0].categoryColor} mb-2 inline-block`}>
                                    {articles[0].category}
                                </span>
                                <h3 className="text-xl font-black text-white">{articles[0].title}</h3>
                            </div>
                        </div>
                        <div className="p-7">
                            <p className="text-gray-600 leading-relaxed mb-5">{articles[0].excerpt}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-400 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{articles[0].readTime} دقائق قراءة</span>
                                    <span>•</span>
                                    <span>{articles[0].date}</span>
                                </div>
                                <Link href={`/blog/${articles[0].slug}`} className="flex items-center gap-1 text-emerald-600 font-bold hover:text-emerald-700 text-sm">
                                    اقرأ المزيد
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar articles */}
                    <div className="flex flex-col gap-6">
                        {articles.slice(1).map((article) => (
                            <article key={article.id} className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex">
                                <div className="relative w-32 shrink-0 overflow-hidden">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="128px"
                                    />
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${article.categoryColor} inline-block mb-2`}>
                                            {article.category}
                                        </span>
                                        <h3 className="font-black text-gray-900 text-sm leading-tight group-hover:text-emerald-600 transition-colors">
                                            {article.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                                        <Clock className="w-3 h-3" />
                                        <span>{article.readTime} د</span>
                                        <span>•</span>
                                        <Link href={`/blog/${article.slug}`} className="text-emerald-600 font-bold hover:underline">
                                            اقرأ
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
