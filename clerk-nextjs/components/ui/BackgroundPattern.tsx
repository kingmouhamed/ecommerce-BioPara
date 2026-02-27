"use client";

import React from 'react';

interface BackgroundPatternProps {
  opacity?: number;
  className?: string;
}

export default function BackgroundPattern({ opacity = 0.1, className = '' }: BackgroundPatternProps) {
  return (
    <div 
      className={`absolute inset-0 bg-[url('/images/backgrounds/pattern.svg')] ${className}`}
      style={{ opacity }}
    />
  );
}
