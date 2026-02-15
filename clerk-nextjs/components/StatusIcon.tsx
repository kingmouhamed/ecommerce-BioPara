"use client";

import React from 'react';
import Image from 'next/image';

interface StatusIconProps {
  type: 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatusIcon({ type, size = 'md', className = '' }: StatusIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const iconMap = {
    success: '/images/ui/success-icon.svg',
    error: '/images/ui/error-icon.svg',
    warning: '/images/ui/warning-icon.svg',
    info: '/images/ui/info-icon.svg'
  };

  return (
    <Image
      src={iconMap[type]}
      alt={`${type} icon`}
      width={size === 'sm' ? 16 : size === 'lg' ? 32 : 24}
      height={size === 'sm' ? 16 : size === 'lg' ? 32 : 24}
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}
