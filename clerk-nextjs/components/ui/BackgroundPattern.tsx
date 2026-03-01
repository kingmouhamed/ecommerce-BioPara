"use client";

import React from 'react';

interface BackgroundPatternProps {
  opacityClass?: string;
  className?: string;
}

export default function BackgroundPattern({ opacityClass = 'opacity-10', className = '' }: BackgroundPatternProps) {
  return (
    <div 
      className={`absolute inset-0 bg-[url('/images/backgrounds/pattern.svg')] ${opacityClass} ${className}`}
    />
  );
}
