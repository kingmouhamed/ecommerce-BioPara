"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Sparkles } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  backgroundImage?: string;
  primaryAction?: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  badge?: {
    text: string;
    icon: React.ReactNode;
  };
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage = '/images/backgrounds/hero-bg.jpg',
  primaryAction,
  secondaryAction,
  badge
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.currentTarget;
            target.src = '/images/backgrounds/hero-bg.jpg';
          }}
          unoptimized={backgroundImage.endsWith('.png')}
        />
        <BackgroundPattern opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-emerald-100/60"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              {badge.icon}
              {badge.text}
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl transition-colors transform hover:scale-105"
              >
                {primaryAction.text}
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold px-6 py-3 rounded-2xl border border-gray-200 transition-colors transform hover:scale-105"
              >
                {secondaryAction.text}
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
