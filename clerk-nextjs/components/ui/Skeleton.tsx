"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  children,
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'pulse'
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-bounce',
    none: ''
  };

  const baseClasses = cn(
    'bg-gray-300',
    variantClasses[variant],
    animationClasses[animation],
    className
  );

  const style = {
    width: width || (variant === 'text' ? '100%' : '40px'),
    height: height || (variant === 'text' ? '1rem' : '40px')
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{
              height: height || '1rem'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={baseClasses} style={style}>
      {children}
    </div>
  );
};

// Skeleton components for common use cases
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
    <Skeleton variant="rectangular" height="200px" className="w-full" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" lines={2} />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width="80px" />
        <Skeleton variant="text" width="60px" />
      </div>
      <Skeleton variant="rectangular" height="40px" className="w-full rounded-lg" />
    </div>
  </div>
);

export const CategoryCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
    <Skeleton variant="rectangular" height="150px" className="w-full" />
    <div className="p-4 space-y-2">
      <Skeleton variant="text" lines={1} />
      <Skeleton variant="text" lines={2} />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ 
  items?: number; 
  className?: string;
  showAvatar?: boolean;
}> = ({ items = 5, className, showAvatar = false }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 space-x-reverse">
        {showAvatar && (
          <Skeleton variant="circular" width="40px" height="40px" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('overflow-x-auto', className)}>
    <table className="w-full">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="px-6 py-3">
              <Skeleton variant="text" width="80px" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <Skeleton variant="text" width="100px" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Skeleton;
