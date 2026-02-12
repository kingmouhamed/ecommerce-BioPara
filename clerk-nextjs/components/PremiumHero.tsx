"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Shield, 
  Truck, 
  Award, 
  ChevronRight, 
  Play, 
  Globe,
  Check,
  ArrowRight
} from 'lucide-react';

export default function PremiumHero() {
  const stats = [
    { number: '1M+', label: 'Happy Customers', icon: <Globe className="w-5 h-5" /> },
    { number: '50+', label: 'Countries', icon: <Truck className="w-5 h-5" /> },
    { number: '4.9/5', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
    { number: '100%', label: 'Natural', icon: <Shield className="w-5 h-5" /> }
  ];

  const trustBadges = [
    { icon: <Shield className="w-6 h-6" />, text: 'Secure Payment' },
    { icon: <Award className="w-6 h-6" />, text: 'Certified Organic' },
    { icon: <Truck className="w-6 h-6" />, text: 'Worldwide Shipping' },
    { icon: <Check className="w-6 h-6" />, text: '30-Day Returns' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-[var(--color-background)] to-[var(--color-surface-alt)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B5E20' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container-premium relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold">
              <Globe className="w-4 h-4" />
              <span>Trusted in 50+ Countries</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-display text-gradient-primary">
                Premium Natural Wellness
                <span className="block text-[var(--color-accent)]">Delivered Globally</span>
              </h1>
              <p className="text-body text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                Experience the finest natural wellness products from Morocco, trusted by over 1 million customers worldwide. 
                From premium argan oil to traditional herbal remedies, we bring nature's best to your doorstep.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-accent group">
                Shop Premium Collection
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline group">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[var(--color-primary)] mb-1">
                    {stat.icon}
                    <span className="text-2xl font-bold">{stat.number}</span>
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)] font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            {/* Main Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-alt)] rounded-2xl shadow-premium-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl flex items-center justify-center shadow-premium">
                      <span className="text-white text-4xl font-bold">B</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-[var(--color-primary)]">Premium Argan Oil</h3>
                      <p className="text-[var(--color-text-secondary)]">100% Pure • Organic • Cold-Pressed</p>
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-sm text-[var(--color-text-secondary)] ml-1">(4.9)</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-accent)]">$24.99</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center animate-float">
                <Award className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                <Shield className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-[var(--color-surface)] rounded-full shadow-premium flex items-center justify-center">
                <Truck className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 bg-[var(--color-surface)] p-3 rounded-xl shadow-premium">
                  <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)]">
                    {badge.icon}
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
