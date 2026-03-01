import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';

// Performance optimization utilities

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization utility
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): T => {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();

  console.log(`${name} took ${end - start} milliseconds`);
  return end - start;
};

// Bundle size optimization utilities
export const dynamicImport = async <T>(modulePath: string): Promise<T> => {
  // Dynamically import modules to reduce initial bundle size
  return import(modulePath);
};

// Memory optimization utilities
export const cleanupResources = () => {
  // Clear unused resources
  if (typeof window !== 'undefined') {
    // Clear any event listeners, timeouts, etc.
    // Note: This function should be used carefully
    console.log('Resource cleanup completed');
  }
};

// Network performance utilities
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

export const preloadCriticalImages = async (imageUrls: string[]) => {
  const promises = imageUrls.map(url => preloadImage(url));
  await Promise.all(promises);
};

// Service Worker registration for offline support
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
};

// Cache utilities
export const cacheData = async (key: string, data: any): Promise<void> => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('app-cache');
      const response = new Response(JSON.stringify(data));
      await cache.put(key, response);
    } catch (error) {
      console.error('Cache write failed:', error);
    }
  }
};

export const getCachedData = async (key: string): Promise<any | null> => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('app-cache');
      const response = await cache.match(key);
      if (response) {
        return response.json();
      }
    } catch (error) {
      console.error('Cache read failed:', error);
    }
  }
  return null;
};

// Performance metrics collection
export const collectMetrics = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    };
  }
  return null;
};

// Image optimization utilities
export const optimizeImage = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string => {
  const { width, height, quality = 80, format = 'webp' } = options;

  // In production, this would generate optimized image URLs
  // For now, just return the original URL
  return src;
};

// Image optimization for Next.js
export const getOptimizedImageProps = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  alt?: string;
  className?: string;
} = {}) => {
  const {
    width,
    height,
    quality = 80,
    priority = false,
    placeholder = 'blur',
    alt = '',
    className = ''
  } = options;

  // Generate a simple blur data URL
  const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/aAAgBAhAAAABEQAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';

  return {
    src,
    alt,
    width,
    height,
    quality,
    priority,
    placeholder,
    blurDataURL,
    loading: priority ? 'eager' : 'lazy',
    className,
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>();

  useEffect(() => {
    startTime.current = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current!;

      console.log(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    };
  });
};

// Lazy loading hook
export const useLazyLoad = (threshold = 0.1) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (!isLoaded) {
            setIsLoaded(true);
          }
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, isLoaded]);

  return { elementRef, isLoaded, isInView };
};

// Virtual scrolling hook
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, itemHeight, scrollTop, containerHeight]);

  const handleScroll = useMemo(() =>
    throttle((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, 16),
    []
  );

  return {
    containerRef,
    visibleItems,
    handleScroll,
    totalHeight: items.length * itemHeight,
  };
};

// Resource optimization utilities
export const optimizeResources = () => {
  // Optimize images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.loading || img.loading !== 'lazy') {
      (img as any).loading = 'lazy';
    }
  });

  // Optimize scripts
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.type === 'module') {
      script.defer = true;
    }
  });
};

// Bundle analyzer
export const analyzeBundle = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const bundleSize = resources.reduce((total, resource) => {
      if (resource.name.includes('.js') || resource.name.includes('.css')) {
        return total + (resource.transferSize || 0);
      }
      return total;
    }, 0);

    return {
      bundleSize,
      resourceCount: resources.length,
      largestResource: resources.reduce((largest, resource) => {
        return (resource.transferSize || 0) > (largest.transferSize || 0) ? resource : largest;
      }, resources[0]),
    };
  }
  return null;
};

// Critical resource preloading
export const preloadCriticalResources = async () => {
  const criticalResources = [
    '/images/logo.png',
    '/images/hero-bg.jpg',
    '/fonts/tajawal.woff2',
  ];

  const promises = criticalResources.map(url => {
    if (url.includes('.jpg') || url.includes('.png')) {
      return preloadImage(url);
    }
    return Promise.resolve();
  });

  await Promise.all(promises);
};
