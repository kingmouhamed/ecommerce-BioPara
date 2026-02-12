"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Shield, 
  Truck, 
  Award, 
  Globe,
  Check,
  Heart,
  ShoppingCart,
  ChevronLeft
} from 'lucide-react';

export default function ArabicCustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: "سارة أحمد",
      country: "🇸🇦 المملكة العربية السعودية",
      flag: "🇸🇦",
      rating: 5,
      date: "منذ أسبوعين",
      comment: "جودة فائقة حقاً! زيت الأرغان نقي وأصيل. شحن سريع للرياض، وصل في حالة مثالية. سأطلب بالتأكيد مرة أخرى!",
      product: "زيت الأرغان الفاخر",
      verified: true
    },
    {
      id: 2,
      name: "محمد الشمري",
      country: "🇦🇪 الإمارات العربية المتحدة",
      flag: "🇦🇪",
      rating: 5,
      date: "منذ شهر",
      comment: "منتجات ممتازة وأصلية مغربية 100%. خدمة العملاء رائعة. الشحن إلى دبي كان سريعاً ومغلفاً بشكل جيد.",
      product: "مجموعة الشاي العشبي",
      verified: true
    },
    {
      id: 3,
      name: "فاطمة الزهراء",
      country: "🇲🇦 المغرب",
      flag: "🇲🇦",
      rating: 5,
      date: "منذ 3 أسابيع",
      comment: "منتجات رائعة ومكونات طبيعية فقط. التغليف فاخر جداً. سعيد جداً بالشراء من علامة تجارية مغربية عالمية.",
      product: "مجموعة العناية الطبيعية",
      verified: true
    },
    {
      id: 4,
      name: "نور الدين قاسم",
      country: "🇩🇿 الجزائر",
      flag: "🇩🇿",
      rating: 5,
      date: "منذ شهرين",
      comment: "جودة استثنائية والأسعار معقولة. الشحن إلى الجزائر استغرق 4 أيام فقط. أوصي به بشدة!",
      product: "زيت الأرغان العضوي",
      verified: true
    },
    {
      id: 5,
      name: "خديجة محمد",
      country: "🇹🇳 تونس",
      flag: "🇹🇳",
      rating: 4,
      date: "منذ أسبوع",
      comment: "منتجات رائعة وجودة عالية. أحببت المكونات الطبيعية والتغليف الأنيق. الشحن إلى تونس كان سريعاً.",
      product: "مجموعة الجمال الفاخرة",
      verified: true
    },
    {
      id: 6,
      name: "عبدالله السعيد",
      country: "🇪🇬 مصر",
      flag: "🇪🇬",
      rating: 5,
      date: "منذ 3 أسابيع",
      comment: "تجربة شراء ممتازة! منتجات أصلية وجودة فائقة. خدمة عملاء ممتازة وشحن سريع للقاهرة.",
      product: "مجموعة العافية المتكاملة",
      verified: true
    }
  ];

  const countries = [
    { flag: "🇸🇦", name: "المملكة العربية السعودية", count: 12543 },
    { flag: "🇲🇦", name: "المغرب", count: 18976 },
    { flag: "🇦🇪", name: "الإمارات", count: 8934 },
    { flag: "🇩🇿", name: "الجزائر", count: 12456 },
    { flag: "🇹🇳", name: "تونس", count: 6789 },
    { flag: "🇪🇬", name: "مصر", count: 9876 },
    { flag: "🇶🇦", name: "قطر", count: 7654 },
    { flag: "🇧🇭", name: "البحرين", count: 5678 }
  ];

  const overallStats = {
    totalReviews: 45678,
    averageRating: 4.9,
    verifiedPurchases: 98,
    countriesServed: 52
  };

  return (
    <section className="section-premium">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Globe className="w-4 h-4" />
            <span>من مجتمعنا العالمي</span>
          </div>
          
          <h2 className="text-headline mb-4 text-right">
            آراء العملاء
            <span className="block text-gradient-accent">من حول العالم</span>
          </h2>
          
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto text-right">
            انضم إلى أكثر من مليون عميل راضٍ في أكثر من 50 دولة يثقون ببيوبارا لاحتياجات العافية الطبيعية
          </p>
        </div>

        {/* Overall Stats */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl p-8 mb-16 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallStats.totalReviews.toLocaleString('ar-EG')}</div>
              <div className="text-[var(--color-background)]/80">إجمالي المراجعات</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                {overallStats.averageRating}
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div className="text-[var(--color-background)]/80">متوسط التقييم</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallStats.verifiedPurchases}%</div>
              <div className="text-[var(--color-background)]/80">مشتريات موثقة</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallStats.countriesServed}+</div>
              <div className="text-[var(--color-background)]/80">دولة مخدومة</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reviews.map((review) => (
            <div key={review.id} className="card-premium p-6 hover-lift">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--color-surface-alt)] rounded-full flex items-center justify-center text-2xl">
                    {review.flag}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-text-primary)]">{review.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{review.country}</div>
                  </div>
                </div>
                {review.verified && (
                  <div className="trust-badge-success text-xs">
                    <Check className="w-3 h-3" />
                    موثق
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">{review.rating}.0</span>
              </div>

              {/* Comment */}
              <p className="text-body text-[var(--color-text-secondary)] mb-4 leading-relaxed text-right">
                {review.comment}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{review.product}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{review.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
                    <Heart className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Countries Served */}
        <div className="bg-[var(--color-surface-alt)] rounded-2xl p-8">
          <h3 className="text-title text-center mb-8 text-right">عملاء في أكثر من 50 دولة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {countries.map((country, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{country.flag}</div>
                <div className="text-sm font-medium text-[var(--color-text-primary)] text-right">{country.name}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">{country.count.toLocaleString('ar-EG')} عميل</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-title mb-4 text-right">انضم إلى مجتمعنا العالمي</h3>
          <p className="text-body text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto text-right">
            استمتع بالعافية الطبيعية الفاخرة الموثوقة من قبل العملاء حول العالم. شحن سريع وآمن لباب منزلك.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-accent group">
              <ShoppingCart className="w-5 h-5 ml-2" />
              تسوق المجموعة الفاخرة
              <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="btn-outline">
              <Globe className="w-5 h-5 ml-2" />
              عرض جميع المراجعات
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
