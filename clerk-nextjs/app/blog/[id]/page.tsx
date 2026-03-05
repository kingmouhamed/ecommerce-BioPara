'use client'

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Clock, Share2 } from 'lucide-react';
import { getBlogPostById, getAllBlogPosts } from '@/lib/blog';

type BlogPost = ReturnType<typeof getBlogPostById>;

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    const postData = getBlogPostById(id);
    setPost(postData);
    setLoading(false);

    // TRIGGER 404 if item doesn't exist
    if (!postData) {
      notFound();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-700 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.image || "/images/blog/blog-banner-1.png"}
            alt={post.title}
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-emerald-700/60 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 text-sm text-emerald-100 mb-6">
              <span className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                {post.category}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime || "5 دقائق"}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white">
                  {post.author?.charAt(0) || "ب"}
                </div>
                <div>
                  <p className="font-semibold text-white">{post.author}</p>
                  <p className="text-emerald-100 text-sm">كاتب محتوى</p>
                </div>
              </div>

              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            
            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-6">
                {post.content?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                )) || (
                  <p className="text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">الوسوم</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-xl">
                  {post.author?.charAt(0) || "ب"}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    خبير في التغذية والأعشاب الطبية، مع أكثر من 10 سنوات من الخبرة في مجال الطب البديل
                    والمكملات الغذائية الطبيعية.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">مقالات ذات صلة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getAllBlogPosts()
                  .filter(p => p.id !== post.id)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <article
                      key={relatedPost.id}
                      className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={relatedPost.image || "/images/blog/blog-banner-1.png"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4" />
                          {relatedPost.date}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <Link
                          href={`/blog/${relatedPost.id}`}
                          className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                        >
                          اقرأ المزيد
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-colors"
              >
                العودة إلى المدونة
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
