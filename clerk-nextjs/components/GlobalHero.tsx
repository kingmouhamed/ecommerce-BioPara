"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Shield, Truck, Globe, ArrowRight, Check } from 'lucide-react';

export default function GlobalHero() {
  const [isPlaying, setIsPlaying] = useState(false);

  const stats = [
    { number: "50+", label: "Countries", icon: <Globe className="w-5 h-5" /> },
    { number: "1M+", label: "Happy Customers", icon: <Star className="w-5 h-5" /> },
    { number: "4.9/5", label: "Average Rating", icon: <Star className="w-5 h-5" /> },
    { number: "24/7", label: "Support", icon: <Shield className="w-5 h-5" /> }
  ];

  const benefits = [
    "Premium Quality Ingredients",
    "Worldwide Free Shipping",
    "30-Day Money Back Guarantee",
    "ISO & GMP Certified"
  ];

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B5E20' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-right">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Globe className="w-4 h-4" />
              <span>Trusted in 50+ Countries Worldwide</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
              Premium Natural Wellness
              <span className="block text-emerald-600">Delivered Worldwide</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-neutral-medium mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover authentic Moroccan argan oil, herbal remedies, and premium parapharmacy products. 
              Trusted by over 1 million customers across Europe, America, and the Gulf.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl mx-auto lg:mx-0">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-neutral-dark">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link 
                href="/products" 
                className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 mr-2" />
              </Link>
              <Link 
                href="/about" 
                className="btn-secondary text-lg px-8 py-4 border-2 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Our Story
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto lg:mx-0">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                    {stat.icon}
                    <span className="text-2xl font-bold">{stat.number}</span>
                  </div>
                  <div className="text-sm text-neutral-medium font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            {/* Main Product Image */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="aspect-square lg:aspect-[4/5] relative">
                <Image
                  src="/premium-hero-products.jpg"
                  alt="Premium Natural Wellness Products"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Trust Badge */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-dark">4.9/5</div>
                    <div className="text-sm text-neutral-medium">50,000+ Reviews</div>
                  </div>
                </div>
              </div>

              {/* Floating Video Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute bottom-6 right-6 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-xl hover:bg-emerald-700 transition-colors group"
              >
                <Play className="w-6 h-6 text-white ml-1 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-100 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative aspect-video">
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Video embed would go here */}
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
