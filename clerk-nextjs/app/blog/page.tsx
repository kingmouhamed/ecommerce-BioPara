import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getAllBlogPosts } from '../../lib/blog';

export const metadata = {
    title: 'المدونة | BioPara',
    description: 'مقالات ومعلومات مفيدة عن الأعشاب والمنتجات الطبيعية والمقالات الصحية.',
};

export default function BlogPage() {
    const articles = getAllBlogPosts();

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">دليل الأعشاب والمدونة الصحية</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        مقالات ومعلومات مفيدة عن الأعشاب والمنتجات الطبيعية للصحة العقلية والجسدية
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link href={`/blog/${article.id}`} key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all block">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/90 backdrop-blur text-emerald-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                        {article.readTime}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {article.excerpt}
                                </p>
                                <div className="inline-flex items-center gap-2 text-emerald-600 font-medium group-hover:text-emerald-700">
                                    اقرأ المقال كاملاً
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
