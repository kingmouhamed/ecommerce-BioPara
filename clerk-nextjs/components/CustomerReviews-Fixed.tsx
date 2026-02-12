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
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// TypeScript Interface for Props
interface CustomerReviewsProps {
  locale?: 'ar' | 'en' | 'fr';
  variant?: 'default' | 'global';
  showStats?: boolean;
  showCountries?: boolean;
  showCTA?: boolean;
  maxReviews?: number;
}

export default function CustomerReviews({ 
  locale = 'ar', 
  variant = 'default',
  showStats = true,
  showCountries = true,
  showCTA = true,
  maxReviews = 6
}: CustomerReviewsProps) {
  // Localization Data
  const localization = {
    ar: {
      header: {
        title: 'آراء العملاء',
        subtitle: 'من حول العالم'
      },
      stats: {
        totalReviews: '45,678',
        averageRating: '4.9/5',
        verifiedPurchases: '98%',
        countriesServed: '52'
      },
      cta: {
        title: 'انضم إلى مجتمعنا العالمي',
        description: 'استمتع بالعافية الطبيعية الفاخرة الموثوقة من قبل العملاء حول العالم. شحن سريع وآمن لباب منزلك.',
        primaryButton: 'تسوق المجموعة الفاخرة',
        secondaryButton: 'عرض جميع المراجعات'
      },
      countries: [
        { flag: '🇸🇦', name: 'المملكة العربية السعودية', count: 12543 },
        { flag: '🇲🇦', name: 'المغرب', count: 18976 },
        { flag: '🇦🇦', name: 'الإمارات العربية المتحدة', count: 8934 },
        { flag: '🇩🇶', name: 'قطر', count: 7654 },
        { flag: '🇩🇦', name: 'الكويت', count: 5678 },
        { flag: '🇪🇸', name: 'عُمان', count: 9876 },
        { flag: '🇹🇳', name: 'تونس', count: 6789 },
        { flag: '🇪🇦', name: 'البحرين', count: 4567 }
      ],
      reviews: [
        {
          id: 1,
          name: 'سارة أحمد',
          country: '🇸🇦 المملكة العربية السعودية',
          flag: '🇸🇦',
          rating: 5,
          date: 'منذ أسبوعين',
          comment: 'جودة فائقة حقاً! زيت الأرغان نقي وأصيل. شحن سريع إلى الرياض، وصل في حالة مثالية. سأطلب بالتأكيد مرة أخرى!',
          product: 'زيت الأرغان الفاخر',
          verified: true
        },
        {
          id: 2,
          name: 'محمد الشمري',
          country: '🇲🇦 المغرب',
          flag: '🇲🇦',
          rating: 5,
          date: 'منذ شهر',
          comment: 'جودة ممتازة ومنتجات مغربية أصيلة. خدمة العملاء ممتازة والشحن إلى الدار البيضاء كان سريعاً ومغلفاً بشكل جيد.',
          product: 'مجموعة الشاي العشبي',
          verified: true
        },
        {
          id: 3,
          name: 'فاطمة الزهراء',
          country: '🇦🇦 الإمارات العربية المتحدة',
          flag: '🇦🇦',
          rating: 5,
          date: 'منذ 3 أسابيع',
          comment: 'منتجات رائعة ومكونات طبيعية 100%. أحببت التغليف الفاخر والشحن السريع إلى دبي.',
          product: 'مجموعة العناية الطبيعية',
          verified: true
        },
        {
          id: 4,
          name: 'نور الدين قاسم',
          country: '🇩🇶 قطر',
          flag: '🇩🇶',
          rating: 5,
          date: 'منذ أسبوعين',
          comment: 'تجربة شراء ممتازة! منتجات عالية الجودة وخدمة عملاء ممتازة. الشحن إلى الدوحة كان سريعاً وآمناً.',
          product: 'زيت الأرغان العضوي',
          verified: true
        },
        {
          id: 5,
          name: 'خديجة محمد',
          country: '🇹🇳 تونس',
          flag: '🇹🇳',
          rating: 5,
          date: 'منذ 3 أسابيع',
          comment: 'منتجات جيدة وجودة معتمدة. التغليف أنيق والشحن إلى تونس كان معقولاً. أوصي به!',
          product: 'مجموعة الجمال الفاخرة',
          verified: true
        },
        {
          id: 6,
          name: 'عبدالله السعيد',
          country: '🇪🇸 عُمان',
          flag: '🇪🇸',
          rating: 5,
          date: 'منذ شهر',
          comment: 'منتجات طبيعية فاخرة وأصلية. خدمة عملاء ممتازة وشحن موثوق إلى مسقط.',
          product: 'مجموعة العافية المتكاملة',
          verified: true
        }
      ],
      trustBadges: [
        { icon: <Shield className="w-6 h-6" />, text: 'دفع آمن' },
        { icon: <Award className="w-6 h-6" />, text: 'عضوي معتمد' },
        { icon: <Truck className="w-6 h-6" />, text: 'شحن عالمي' },
        { icon: <Check className="w-6 h-6" />, text: 'إرجاع 30 يوم' }
      ]
    },
    en: {
      header: {
        title: 'Customer Reviews',
        subtitle: 'From Around the World'
      },
      stats: {
        totalReviews: '45,678',
        averageRating: '4.9/5',
        verifiedPurchases: '98%',
        countriesServed: '52'
      },
      cta: {
        title: 'Join Our Global Community',
        description: 'Experience premium natural wellness trusted by customers worldwide. Fast, secure shipping to your doorstep.',
        primaryButton: 'Shop Premium Collection',
        secondaryButton: 'View All Reviews'
      },
      countries: [
        { flag: '🇬🇧', name: 'United Kingdom', count: 12543 },
        { flag: '🇺🇸', name: 'United States', count: 18976 },
        { flag: '🇸🇦', name: 'Saudi Arabia', count: 8934 },
        { flag: '🇫🇷', name: 'France', count: 12456 },
        { flag: '🇦🇪', name: 'UAE', count: 6789 },
        { flag: '🇪🇸', name: 'Spain', count: 5678 },
        { flag: '🇩🇪', name: 'Germany', count: 9876 },
        { flag: '🇨🇦', name: 'Canada', count: 7654 }
      ],
      reviews: [
        {
          id: 1,
          name: 'Sarah Johnson',
          country: '🇬🇧 United Kingdom',
          flag: '🇬🇧',
          rating: 5,
          date: '2 weeks ago',
          comment: 'Absolutely premium quality! The argan oil is pure and authentic. Fast shipping to London, arrived in perfect condition. Will definitely order again!',
          product: 'Premium Argan Oil',
          verified: true
        },
        {
          id: 2,
          name: 'Mohammed Al-Rashid',
          country: '🇸🇦 Saudi Arabia',
          flag: '🇸🇦',
          rating: 5,
          date: '1 month ago',
          comment: 'Excellent quality and authentic Moroccan products. The customer service is outstanding. Shipping to Riyadh was quick and well-packaged.',
          product: 'Herbal Tea Collection',
          verified: true
        },
        {
          id: 3,
          name: 'Emma Chen',
          country: '🇺🇸 United States',
          flag: '🇺🇸',
          rating: 4,
          date: '3 weeks ago',
          comment: 'Great products! Love the natural ingredients and premium packaging. Shipping took 5 days to California which was reasonable.',
          product: 'Natural Skincare Set',
          verified: true
        },
        {
          id: 4,
          name: 'Pierre Dubois',
          country: '🇫🇷 France',
          flag: '🇫🇷',
          rating: 5,
          date: '2 months ago',
          comment: 'Très satisfait! Les produits sont de haute qualité et livrés rapidement à Paris. Je recommande vivement BioPara!',
          product: 'Organic Argan Oil',
          verified: true
        },
        {
          id: 5,
          name: 'Ahmed Hassan',
          country: '🇦🇪 United Arab Emirates',
          flag: '🇦🇪',
          rating: 5,
          date: '1 week ago',
          comment: 'Outstanding service and premium quality products. The international shipping is reliable and fast to Dubai. Very impressed!',
          product: 'Premium Wellness Bundle',
          verified: true
        },
        {
          id: 6,
          name: 'Maria Rodriguez',
          country: '🇪🇸 Spain',
          flag: '🇪🇸',
          rating: 5,
          date: '3 weeks ago',
          comment: 'Productos excelentes! Calidad premium y envío rápido a Madrid. Muy contenta con mi compra. ¡Recomendado!',
          product: 'Natural Beauty Collection',
          verified: true
        }
      ],
      trustBadges: [
        { icon: <Shield className="w-6 h-6" />, text: 'Secure Payment' },
        { icon: <Award className="w-6 h-6" />, text: 'Certified Organic' },
        { icon: <Truck className="w-6 h-6" />, text: 'Worldwide Shipping' },
        { icon: <Check className="w-6 h-6" />, text: '30-Day Returns' }
      ]
    },
    fr: {
      header: {
        title: 'Avis Clients',
        subtitle: 'Du Monde Entier'
      },
      stats: {
        totalReviews: '45,678',
        averageRating: '4.9/5',
        verifiedPurchases: '98%',
        countriesServed: '52'
      },
      cta: {
        title: 'Rejoignez Notre Communauté Mondiale',
        description: 'Découvrez le bien-être naturel premium approuvé par les clients du monde entier. Livraison rapide et sécurisée à votre porte.',
        primaryButton: 'Collection Premium',
        secondaryButton: 'Voir Tous les Avis'
      },
      countries: [
        { flag: '🇬🇧', name: 'Royaume-Uni', count: 12543 },
        { flag: '🇺🇸', name: 'États-Unis', count: 18976 },
        { flag: '🇸🇦', name: 'Arabie Saoudite', count: 8934 },
        { flag: '🇫🇷', name: 'France', count: 12456 },
        { flag: '🇦🇪', name: 'EAU', count: 6789 },
        { flag: '🇪🇸', name: 'Espagne', count: 5678 },
        { flag: '🇩🇪', name: 'Allemagne', count: 9876 },
        { flag: '🇨🇦', name: 'Canada', count: 7654 }
      ],
      reviews: [
        {
          id: 1,
          name: 'Sarah Johnson',
          country: '🇬🇧 Royaume-Uni',
          flag: '🇬🇧',
          rating: 5,
          date: 'Il y a 2 semaines',
          comment: 'Qualité premium absolue! L\'huile d\'argan est pure et authentique. Livraison rapide à Londres, arrivée en condition parfaite. Commandera à nouveau!',
          product: 'Huile d\'Argan Premium',
          verified: true
        },
        {
          id: 2,
          name: 'Mohammed Al-Rashid',
          country: '🇸🇦 Arabie Saoudite',
          flag: '🇸🇦',
          rating: 5,
          date: 'Il y a 1 mois',
          comment: 'Qualité excellente et produits marocains authentiques. Le service client est exceptionnel. Livraison à Riyad rapide et bien emballée.',
          product: 'Collection de Thés aux Herbes',
          verified: true
        },
        {
          id: 3,
          name: 'Emma Chen',
          country: '🇺🇸 États-Unis',
          flag: '🇺🇸',
          rating: 4,
          date: 'Il y a 3 semaines',
          comment: 'Produits excellents! J\'adore les ingrédients naturels et l\'emballage premium. La livraison a pris 5 jours pour la Californie, ce qui était raisonnable.',
          product: 'Ensemble Soins Naturels',
          verified: true
        },
        {
          id: 4,
          name: 'Pierre Dubois',
          country: '🇫🇷 France',
          flag: '🇫🇷',
          rating: 5,
          date: 'Il y a 2 mois',
          comment: 'Très satisfait! Les produits sont de haute qualité et livrés rapidement à Paris. Je recommande vivement BioPara!',
          product: 'Huile d\'Argan Biologique',
          verified: true
        },
        {
          id: 5,
          name: 'Ahmed Hassan',
          country: '🇦🇪 EAU',
          flag: '🇦🇪',
          rating: 5,
          date: 'Il y a 1 semaine',
          comment: 'Service exceptionnel et produits de qualité premium. La livraison internationale est fiable et rapide à Dubai. Très impressionné!',
          product: 'Pack Bien-être Premium',
          verified: true
        },
        {
          id: 6,
          name: 'Maria Rodriguez',
          country: '🇪🇸 Espagne',
          flag: '🇪🇸',
          rating: 5,
          date: 'Il y a 3 semaines',
          comment: 'Produits excelentes! Qualité premium et livraison rapide à Madrid. Très content avec mon achat. Recommandé!',
          product: 'Collection Beauté Naturelle',
          verified: true
        }
      ],
      trustBadges: [
        { icon: <Shield className="w-6 h-6" />, text: 'Paiement Sécurisé' },
        { icon: <Award className="w-6 h-6" />, text: 'Biologique Certifié' },
        { icon: <Truck className="w-6 h-6" />, text: 'Livraison Mondiale' },
        { icon: <Check className="w-6 h-6" />, text: 'Retour 30 Jours' }
      ]
    }
  };

  const currentLang = localization[locale as keyof typeof localization] || localization.ar;

  // CSS Classes based on variant
  const getSectionClasses = () => {
    return variant === 'global' ? 'section-premium' : 'section-premium';
  };

  const getContainerClasses = () => {
    return variant === 'global' ? 'container-premium' : 'container-premium';
  };

  const getCardClasses = () => {
    return variant === 'global' ? 'card-premium p-6 hover-lift' : 'card-premium p-6 hover-lift';
  };

  const getTrustBadgeClasses = () => {
    return variant === 'global' ? 'trust-badge-success text-xs' : 'trust-badge-success text-xs';
  };

  const getButtonClasses = () => {
    return variant === 'global' ? 'btn-accent group' : 'btn-accent group';
  };

  return (
    <section className={getSectionClasses()} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className={getContainerClasses()}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Globe className="w-4 h-4" />
            <span>{currentLang.header.title}</span>
          </div>
          
          <h2 className="text-headline mb-4">
            {currentLang.header.title}
            <span className="block text-gradient-accent">{currentLang.header.subtitle}</span>
          </h2>
          
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            {currentLang.cta.description}
          </p>
        </div>

        {/* Overall Stats */}
        {showStats && (
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl p-8 mb-16 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{currentLang.stats.totalReviews}</div>
                <div className="text-[var(--color-background)]/80">{locale === 'ar' ? 'إجمالي المراجعات' : 'Total Reviews'}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                  {currentLang.stats.averageRating}
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div className="text-[var(--color-background)]/80">{locale === 'ar' ? 'متوسط التقييم' : 'Average Rating'}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{currentLang.stats.verifiedPurchases}%</div>
                <div className="text-[var(--color-background)]/80">{locale === 'ar' ? 'مشتريات موثقة' : 'Verified Purchases'}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{currentLang.stats.countriesServed}+</div>
                <div className="text-[var(--color-background)]/80">{locale === 'ar' ? 'دولة مخدومة' : 'Countries Served'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentLang.reviews.slice(0, maxReviews).map((review) => (
            <div key={review.id} className={getCardClasses()}>
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
                  <div className={getTrustBadgeClasses()}>
                    <Check className="w-3 h-3" />
                    {locale === 'ar' ? 'موثق' : 'Verified'}
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
              <p className="text-body text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                {review.comment}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{review.product}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{review.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors" aria-label={locale === 'ar' ? 'أعجبني' : 'Like'}>
                    <Heart className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Countries Served */}
        {showCountries && (
          <div className="bg-[var(--color-surface-alt)] rounded-2xl p-8">
            <h3 className="text-title text-center mb-8">
              {locale === 'ar' ? 'عملاء في أكثر من 50 دولة' : 'Customers in 50+ Countries'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {currentLang.countries.map((country, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-2">{country.flag}</div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{country.name}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {locale === 'ar' ? `${country.count} عميل` : `${country.count.toLocaleString()} customers`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {showCTA && (
          <div className="text-center mt-16">
            <h3 className="text-title mb-4">{currentLang.cta.title}</h3>
            <p className="text-body text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
              {currentLang.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className={getButtonClasses()}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {currentLang.cta.primaryButton}
                {locale === 'ar' ? <ChevronLeft className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
              <button className="btn-outline">
                <Globe className="w-5 h-5 mr-2" />
                {currentLang.cta.secondaryButton}
                {locale === 'ar' ? <ChevronLeft className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
