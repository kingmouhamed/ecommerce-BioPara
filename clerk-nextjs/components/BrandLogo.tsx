"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  name: string;
  logo: string;
  href: string;
  className?: string;
}

export default function BrandLogo({ name, logo, href, className = '' }: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-center bg-white border border-gray-200 rounded-2xl p-4 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 ${className}`}
    >
      <Image
        src={logo}
        alt={name}
        width={120}
        height={50}
        className="object-contain h-12 filter grayscale group-hover:grayscale-0 transition-all duration-300"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget;
          target.src = '/images/placeholders/brand-placeholder.jpg';
        }}
      />
    </Link>
  );
}
