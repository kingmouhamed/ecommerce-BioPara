"use client";

import React from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/images/ui/leaf-spinner.png"
          alt={text}
          width={size === 'sm' ? 32 : size === 'lg' ? 96 : 64}
          height={size === 'sm' ? 32 : size === 'lg' ? 96 : 64}
          className={`${sizeClasses[size]} animate-spin`}
        />
        <span className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {text}
        </span>
      </div>
    </div>
  );
}
