"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Shield, 
  Truck, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Globe,
  Check,
  ArrowRight,
  Search,
  ShoppingCart,
  Sparkles,
  X
} from 'lucide-react';

// TypeScript Interface for Props
interface HeroProps {
  locale?: 'ar' | 'en' | 'fr';
  variant?: 'default' | 'premium' | 'global';
  showStats?: boolean;
  showTrustBadges?: boolean;
  showVideo?: boolean;
  backgroundImage?: string;
}

export default function Hero({ 
  locale = 'ar', 
  variant = 'default',
  showStats = true,
  showTrustBadges = true,
  showVideo = false,
  backgroundImage
}: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Localization Data
  const localization = {
    ar: {
      hero: {
        title: 'العافية الطبيعية الفاخرة',
        subtitle: 'تصل لكل العالم',
        description: 'استمتع بأجود منتجات العافية الطبيعية من المغرب، الموثوقة من قبل أكثر من مليون عميل حول العالم. من زيت الأرغان الفاخر إلى العلاجات العشبية التقليدية، نقدم أفضل الطبيعة لباب منزلك.',
        trustBadge: 'موثوق في أكثر من 50 دولة',
        ctaPrimary: 'تسوق المجموعة الفاخرة',
        ctaSecondary: 'شاهد قصتنا',
        searchPlaceholder: 'ابحث عن منتجات طبيعية فاخرة...'
      },
      stats: [
        { number: '1M+', label: 'عميل سعيد', icon: <Globe className="w-5 h-5" /> },
        { number: '50+', label: 'دولة', icon: <Truck className="w-5 h-5" /> },
        { number: '4.9/5', label: 'متوسط التقييم', icon: <Star className="w-5 h-5" /> },
        { number: '100%', label: 'طبيعي', icon: <Shield className="w-5 h-5" /> }
      ],
      trustBadges: [
        { icon: <Shield className="w-6 h-6" />, text: 'دفع آمن' },
        { icon: <Award className="w-6 h-6" />, text: 'عضوي معتمد' },
        { icon: <Truck className="w-6 h-6" />, text: 'شحن عالمي' },
        { icon: <Check className="w-6 h-6" />, text: 'إرجاع 30 يوم' }
      ],
      popularSearches: ['زيت الأرغان', 'شاي الأعشاب', 'العناية الطبيعية', 'منتجات عضوية']
    },
    en: {
      hero: {
        title: 'Premium Natural Wellness',
        subtitle: 'Delivered Worldwide',
        description: 'Experience the finest natural wellness products from Morocco, trusted by over 1 million customers worldwide. From premium argan oil to traditional herbal remedies, we bring the best of nature to your doorstep.',
        trustBadge: 'Trusted in 50+ Countries',
        ctaPrimary: 'Shop Premium Collection',
        ctaSecondary: 'Watch Our Story',
        searchPlaceholder: 'Search for premium natural products...'
      },
      stats: [
        { number: '1M+', label: 'Happy Customers', icon: <Globe className="w-5 h-5" /> },
        { number: '50+', label: 'Countries', icon: <Truck className="w-5 h-5" /> },
        { number: '4.9/5', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
        { number: '100%', label: 'Natural', icon: <Shield className="w-5 h-5" /> }
      ],
      trustBadges: [
        { icon: <Shield className="w-6 h-6" />, text: 'Secure Payment' },
        { icon: <Award className="w-6 h-6" />, text: 'Certified Organic' },
        { icon: <Truck className="w-6 h-6" />, text: 'Worldwide Shipping' },
        { icon: <Check className="w-6 h-6" />, text: '30-Day Returns' }
      ],
      popularSearches: ['Argan Oil', 'Herbal Tea', 'Natural Care', 'Organic Products']
    },
    fr: {
      hero: {
        title: 'Bien-être Naturel Premium',
        subtitle: 'Livraison Mondiale',
        description: 'Découvrez les meilleurs produits de bien-être naturel du Maroc, approuvés par plus d\'un million de clients dans le monde. De l\'huile d\'argan premium aux remèdes à base de plantes traditionnelles.',
        trustBadge: 'Approuvé dans 50+ Pays',
        ctaPrimary: 'Collection Premium',
        ctaSecondary: 'Notre Histoire',
        searchPlaceholder: 'Rechercher des produits naturels premium...'
      },
      stats: [
        { number: '1M+', label: 'Clients Satisfaits', icon: <Globe className="w-5 h-5" /> },
        { number: '50+', label: 'Pays', icon: <Truck className="w-5 h-5" /> },
        { number: '4.9/5', label: 'Note Moyenne', icon: <Star className="w-5 h-5" /> },
        { number: '100%', label: 'Naturel', icon: <Shield className="w-5 h-5" /> }
      ],
      trustBadges: [
        { icon: <Shield className="w-6 h-6" />, text: 'Paiement Sécurisé' },
        { icon: <Award className="w-6 h-6" />, text: 'Biologique Certifié' },
        { icon: <Truck className="w-6 h-6" />, text: 'Livraison Mondiale' },
        { icon: <Check className="w-6 h-6" />, text: 'Retour 30 Jours' }
      ],
      popularSearches: ['Huile d\'Argan', 'Thé aux Herbes', 'Soins Naturels', 'Produits Bio']
    }
  };

  const currentLang = localization[locale as keyof typeof localization] || localization.ar;

  // CSS Classes based on variant
  const getHeroClasses = () => {
    switch (variant) {
      case 'default':
        return "relative bg-cover bg-center bg-no-repeat py-12 sm:py-16 lg:py-24 min-h-[320px] sm:min-h-[520px] hero-background";
      case 'premium':
      case 'global':
        return "relative bg-gradient-to-br from-[var(--color-background)] to-[var(--color-surface-alt)] overflow-hidden";
      default:
        return "relative bg-gradient-to-br from-[var(--color-background)] to-[var(--color-surface-alt)] overflow-hidden";
    }
  };

  const getContainerClasses = () => {
    switch (variant) {
      case 'default':
        return "container mx-auto px-4";
      case 'premium':
      case 'global':
        return "container-premium relative";
      default:
        return "container mx-auto px-4";
    }
  };

  const getGridClasses = () => {
    switch (variant) {
      case 'default':
        return "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center";
      case 'premium':
      case 'global':
        return "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20";
      default:
        return "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20";
    }
  };

  const getTrustBadgeClasses = () => {
    switch (variant) {
      case 'global':
        return "inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg";
      case 'premium':
      case 'default':
        return "inline-flex items-center gap-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold";
      default:
        return "inline-flex items-center gap-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold";
    }
  };

  return (
    <section className={getHeroClasses()} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Pattern for Premium Variants */}
      {(variant === 'premium' || variant === 'global') && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B5E20' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      )}

      {/* Overlay for Default Variant */}
      {variant === 'default' && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-teal-900/30"></div>
      )}

      <div className={getContainerClasses()}>
        <div className={getGridClasses()}>
          {/* Left/Right Content based on locale */}
          <div className={`space-y-8 ${locale === 'ar' && (variant === 'premium' || variant === 'global') ? 'lg:order-2' : ''}`}>
            {/* Trust Badge */}
            <div className={getTrustBadgeClasses()}>
              <Globe className="w-4 h-4" />
              <span>{currentLang.hero.trustBadge}</span>
            </div>

            {/* Main Heading */}
            <h1 className={`${variant === 'global' ? 'text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight' : variant === 'premium' || variant === 'default' ? 'text-display text-gradient-primary mb-4' : ''} ${variant === 'default' ? 'text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg' : ''}`}>
              {variant === 'default' ? (
                <>
                  {locale === 'ar' ? 'اكتشف عالم' : 'Discover the World of'}
                  <span className={variant === 'default' ? 'text-emerald-300 drop-shadow-lg' : variant === 'global' ? 'text-emerald-600' : ''}>
                    {locale === 'ar' ? ' الطبيعة' : ' Natural Wellness'}
                  </span>
                  <br />
                  {locale === 'ar' ? 'والعلاج بالأعشاب' : 'Herbal Medicine'}
                </>
              ) : (
                <>
                  {currentLang.hero.title}
                  <span className={variant === 'global' ? 'block text-emerald-600' : 'block text-gradient-accent'}>
                    {currentLang.hero.subtitle}
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className={`${variant === 'default' ? 'text-sm sm:text-base lg:text-lg text-white/95 mb-4 sm:mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0 drop-shadow-md' : 'text-body text-[var(--color-text-secondary)] leading-relaxed max-w-lg'}`}>
              {variant === 'default' 
                ? (locale === 'ar' ? 'أفضل المنتجات شبه الصيدلية والأعشاب الطبية من أشهر الماركات، توصيل لجميع أنحاء المغرب' : 'Best parapharmacy and herbal medicine products from top brands, delivered throughout Morocco')
                : currentLang.hero.description
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start mb-4 sm:mb-6">
              <button className={variant === 'default' 
                ? "inline-flex items-center gap-1 sm:gap-2 bg-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-emerald-500 transition-all duration-300 hover:shadow-lg hover:scale-105 drop-shadow-md text-xs sm:text-sm"
                : "btn-accent group"
              }>
                {currentLang.hero.ctaPrimary}
                {variant === 'default' ? <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />}
              </button>
              <button className={variant === 'default'
                ? "inline-flex items-center gap-1 sm:gap-2 bg-black/30 backdrop-blur-sm text-white border border-white/50 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-black/40 transition-all duration-300 drop-shadow-md text-xs sm:text-sm"
                : "btn-outline group"
              }>
                {variant === 'default' ? locale === 'ar' ? 'اعرف المزيد' : 'Learn More' : <Play className="w-5 h-5 ml-2" />}
                {currentLang.hero.ctaSecondary}
                {variant === 'default' ? <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            {/* Stats */}
            {showStats && (variant === 'premium' || variant === 'global') && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {currentLang.stats.map((stat: { number: string; label: string; icon: React.ReactNode }, index: number) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 text-[var(--color-primary)] mb-1">
                      {stat.icon}
                      <span className="text-2xl font-bold">{stat.number}</span>
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)] font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right/Left Content - Product Showcase */}
          <div className={`${locale === 'ar' && (variant === 'premium' || variant === 'global') ? 'lg:order-1' : ''}`}>
            {/* Product Image/Video */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-alt)] rounded-2xl shadow-premium-lg overflow-hidden">
                {showVideo && variant === 'global' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center hover:bg-[var(--color-primary)]/20 transition-colors"
                    >
                      <Play className="w-8 h-8 text-[var(--color-primary)]" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl flex items-center justify-center shadow-premium">
                        <span className="text-white text-4xl font-bold">{locale === 'ar' ? 'ب' : 'B'}</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[var(--color-primary)]">
                          {locale === 'ar' ? 'زيت الأرغان الفاخر' : 'Premium Argan Oil'}
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                          {locale === 'ar' ? '100% نقي • عضوي • معصور على البارد' : '100% Pure • Organic • Cold Pressed'}
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-sm text-[var(--color-text-secondary)] mr-1">(4.9)</span>
                        </div>
                        <div className="text-2xl font-bold text-[var(--color-accent)]">
                          {locale === 'ar' ? '249.99 درهم' : '€24.99'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Elements */}
              {(variant === 'premium' || variant === 'global') && (
                <>
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center animate-float">
                    <Award className="w-8 h-8 text-[var(--color-accent)]" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                    <Shield className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <div className="absolute top-1/2 -right-8 w-16 h-16 bg-[var(--color-surface)] rounded-full shadow-premium flex items-center justify-center">
                    <Truck className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                </>
              )}
            </div>

            {/* Trust Badges */}
            {showTrustBadges && (variant === 'premium' || variant === 'global') && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {currentLang.trustBadges.map((badge: { icon: React.ReactNode; text: string }, index: number) => (
                  <div key={index} className="flex items-center gap-3 bg-[var(--color-surface)] p-3 rounded-xl shadow-premium">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)]">
                      {badge.icon}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{badge.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal for Premium Variants */}
      {(variant === 'premium' || variant === 'global') && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl shadow-premium-lg w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder={currentLang.hero.searchPlaceholder}
                  className="flex-1 text-lg outline-none text-right"
                  autoFocus
                />
                <button className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Suggestions */}
              <div className="space-y-2">
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 text-right">
                  {locale === 'ar' ? 'عمليات البحث الشائعة' : 'Popular Searches'}
                </p>
                <div className="flex flex-wrap gap-2 justify-end">
                  {currentLang.popularSearches.map((search: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-[var(--color-surface-alt)] rounded-full text-sm">
                      {search}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
