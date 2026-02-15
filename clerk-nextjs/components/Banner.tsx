"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BannerProps {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  className?: string;
}

export default function Banner({ title, subtitle, image, href, className = '' }: BannerProps) {
  return (
    <Link 
      href={href}
      className={`group block relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      <div className="relative w-full h-64 md:h-80">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.currentTarget;
            target.src = '/images/placeholders/banner-placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
          {subtitle && <p className="text-sm md:text-base opacity-90">{subtitle}</p>}
        </div>
      </div>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 group-hover:bg-white transition-all">
        <span className="text-sm font-semibold">اكتشف</span>
        <ChevronLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
