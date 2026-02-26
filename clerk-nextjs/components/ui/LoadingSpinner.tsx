"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'emerald' | 'blue' | 'red' | 'yellow' | 'purple';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  color = 'emerald'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    emerald: 'border-emerald-600 border-t-emerald-200',
    blue: 'border-blue-600 border-t-blue-200',
    red: 'border-red-600 border-t-red-200',
    yellow: 'border-yellow-600 border-t-yellow-200',
    purple: 'border-purple-600 border-t-purple-200'
  };

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

export default LoadingSpinner;
