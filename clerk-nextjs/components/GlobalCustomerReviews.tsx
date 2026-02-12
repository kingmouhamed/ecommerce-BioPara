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
  ChevronRight
} from 'lucide-react';

export default function GlobalCustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      country: "🇬🇧 United Kingdom",
      flag: "🇬🇧",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely premium quality! The argan oil is pure and authentic. Fast shipping to London, arrived in perfect condition. Will definitely order again!",
      product: "Premium Argan Oil",
      verified: true
    },
    {
      id: 2,
      name: "Mohammed Al-Rashid",
      country: "🇸🇦 Saudi Arabia",
      flag: "🇸🇦",
      rating: 5,
      date: "1 month ago",
      comment: "Excellent quality and authentic Moroccan products. The customer service is outstanding. Shipping to Riyadh was quick and well-packaged.",
      product: "Herbal Tea Collection",
      verified: true
    },
    {
      id: 3,
      name: "Emma Chen",
      country: "🇺🇸 United States",
      flag: "🇺🇸",
      rating: 4,
      date: "3 weeks ago",
      comment: "Great products! Love the natural ingredients and the premium packaging. Shipping took 5 days to California which was reasonable.",
      product: "Natural Skincare Set",
      verified: true
    },
    {
      id: 4,
      name: "Pierre Dubois",
      country: "🇫🇷 France",
      flag: "🇫🇷",
      rating: 5,
      date: "2 months ago",
      comment: "Très satisfait! Les produits sont de haute qualité et livrés rapidement à Paris. Je recommande vivement BioPara!",
      product: "Organic Argan Oil",
      verified: true
    },
    {
      id: 5,
      name: "Ahmed Hassan",
      country: "🇦🇪 United Arab Emirates",
      flag: "🇦🇪",
      rating: 5,
      date: "1 week ago",
      comment: "Outstanding service and premium quality products. The international shipping is reliable and fast to Dubai. Very impressed!",
      product: "Premium Wellness Bundle",
      verified: true
    },
    {
      id: 6,
      name: "Maria Rodriguez",
      country: "🇪🇸 Spain",
      flag: "🇪🇸",
      rating: 5,
      date: "3 weeks ago",
      comment: "Productos excelentes! Calidad premium y envío rápido a Madrid. Muy contenta con mi compra. ¡Recomendado!",
      product: "Natural Beauty Collection",
      verified: true
    }
  ];

  const countries = [
    { flag: "🇬🇧", name: "United Kingdom", count: 12543 },
    { flag: "🇺🇸", name: "United States", count: 18976 },
    { flag: "🇸🇦", name: "Saudi Arabia", count: 8934 },
    { flag: "🇫🇷", name: "France", count: 12456 },
    { flag: "🇦🇪", name: "UAE", count: 6789 },
    { flag: "🇪🇸", name: "Spain", count: 5678 },
    { flag: "🇩🇪", name: "Germany", count: 9876 },
    { flag: "🇨🇦", name: "Canada", count: 7654 }
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
            <span>From Our Global Community</span>
          </div>
          
          <h2 className="text-headline mb-4">
            Customer Reviews
            <span className="block text-gradient-accent">From Around the World</span>
          </h2>
          
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Join over 1 million satisfied customers across 50+ countries who trust BioPara for their natural wellness needs
          </p>
        </div>

        {/* Overall Stats */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl p-8 mb-16 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallStats.totalReviews.toLocaleString()}</div>
              <div className="text-[var(--color-background)]/80">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                {overallStats.averageRating}
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div className="text-[var(--color-background)]/80">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallStats.verifiedPurchases}%</div>
              <div className="text-[var(--color-background)]/80">Verified Purchases</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallStats.countriesServed}+</div>
              <div className="text-[var(--color-background)]/80">Countries Served</div>
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
                    Verified
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
          <h3 className="text-title text-center mb-8">Customers in 50+ Countries</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {countries.map((country, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{country.flag}</div>
                <div className="text-sm font-medium text-[var(--color-text-primary)]">{country.name}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">{country.count.toLocaleString()} customers</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-title mb-4">Join Our Global Community</h3>
          <p className="text-body text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Experience premium natural wellness trusted by customers worldwide. Fast, secure shipping to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-accent group">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Shop Premium Collection
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-outline">
              <Globe className="w-5 h-5 mr-2" />
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
