"use client";

import React from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  className?: string;
}

export default function TestimonialCard({ name, role, avatar, content, rating, className = '' }: TestimonialCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={avatar}
          alt={name}
          width={60}
          height={60}
          className="rounded-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.currentTarget;
            target.src = '/images/placeholders/product-placeholder.jpg';
          }}
        />
        <div>
          <div className="font-bold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed">&ldquo;{content}&rdquo;</p>
    </div>
  );
}
