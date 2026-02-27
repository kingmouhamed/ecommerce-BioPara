import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Clock, Share2 } from 'lucide-react';
import { getBlogPostById, getAllBlogPosts } from '../../../lib/blog';

// Pre-render pages at build time
export async function generateStaticParams() {
    const posts = getAllBlogPosts();
    return posts.map((post) => ({
        id: post.id,
    }));
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
    const post = getBlogPostById(params.id);

    if (!post) {
        return {
            title: 'مقال غير موجود | BioPara',
            description: 'المقال الذي تبحث عنه غير متوفر',
            robots: { index: false, follow: false }
        };
    }

    return {
        title: `${post.title} | BioPara المدونة`,
        description: post.excerpt,
    };
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
    const post = getBlogPostById(params.id);

    // TRIGGER 404 if item doesn't exist
    if (!post) {
        notFound();
    }

    // Get other articles for "Read more" footer
    const relatedPosts = getAllBlogPosts()
        .filter(p => p.id !== post.id)
        .slice(0, 3);

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Header */}
            <div className="bg-emerald-50 py-16 lg:py-24 border-b border-emerald-100">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6">
                        <ArrowRight className="w-4 h-4" />
                        العودة للمدونة
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-emerald-600" />
                            <span>{post.readTime} قراءة</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
                <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 max-w-4xl py-16">
                <div className="bg-white rounded-2xl">
                    <p className="text-2xl text-gray-700 font-medium leading-relaxed mb-10 border-r-4 border-emerald-500 pr-6">
                        {post.excerpt}
                    </p>

                    <div className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed space-y-6">
                        {post.content.split('\n').map((paragraph, index) => {
                            if (paragraph.startsWith('-')) {
                                return (
                                    <ul key={index} className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                        <li>{paragraph.substring(1).trim()}</li>
                                    </ul>
                                );
                            }
                            if (paragraph.trim().length === 0) return null;

                            return <p key={index}>{paragraph}</p>;
                        })}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">شارك المقال:</h3>
                        <button className="flex items-center gap-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 px-6 py-3 rounded-xl transition-colors font-medium">
                            <Share2 className="w-5 h-5" />
                            مشاركة
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            <div className="bg-gray-50 py-16 border-t border-gray-200">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">مقالات ذات صلة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.map((related) => (
                            <Link href={`/blog/${related.id}`} key={related.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all block">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={related.image}
                                        alt={related.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow">
                                        {related.readTime}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {related.title}
                                    </h4>
                                    <p className="text-gray-500 text-sm">{related.date}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}
