export const dynamic = 'force-static'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { getAllBlogPosts } from '@/lib/blog'

const blogPosts = getAllBlogPosts()

export const metadata = {
    title: "المدونة الصحية | BioPara",
    description: "اكتشف أحدث المقالات والنصائح الصحّية حول المكملات الغذائية، والأعشاب الطبية، وعسل النحل الأصلي، والزيوت العلاجية.",
}

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <section className="relative bg-emerald-700 py-24 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/blog/blog-banner-1.png"
                        alt="BioPara Blog"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-emerald-700/60 mix-blend-multiply" />
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-100 font-medium text-sm border border-emerald-400/30 mb-6 backdrop-blur-sm">
                        نصائح ومقالات صحية
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        مدونة
                        <span className="text-emerald-300"> بيو</span >
                        <span className="text-white">بارا </span>
                        الصحية
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-emerald-50/90 leading-relaxed font-medium">
                        مصدرك الموثوق لكل ما يخص الصحة والجمال والمكملات الغذائية من الطبيعة الخالصة. اقرأ واستفد من خبراء التغذية لدينا.
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-16 max-w-7xl mx-auto">

                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-gray-100 pb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-emerald-500 rounded-full block"></span>
                            أحدث المقالات
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogPosts.map((post, index) => (
                            <article
                                key={post.id}
                                className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col group"
                            >
                                <div className="relative h-60 w-full overflow-hidden bg-gray-200">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-emerald-700 font-bold text-xs py-1.5 px-3 rounded-full shadow-sm">
                                        {post.category}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow relative">
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            {post.date}
                                        </div>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 transition-colors">
                                            <User className="w-4 h-4 text-emerald-500" />
                                            {post.author}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-emerald-600 transition-colors cursor-pointer">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto border-t border-gray-200 pt-4">
                                        <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors group/link">
                                            اقرأ المزيد
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:-translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <div className="mt-16 text-center">
                        <button className="bg-white border-2 border-emerald-500 text-emerald-600 font-bold text-lg py-3 px-8 rounded-full hover:bg-emerald-50 transition-colors shadow-sm">
                            تحميل المزيد من المقالات
                        </button>
                    </div>

                </div>
            </section>
        </div>
    )
}
