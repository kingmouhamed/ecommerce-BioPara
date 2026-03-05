// =================================
// CACHING SERVICE
// =================================

import { supabaseServer } from '@/lib/supabase/server';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  // In production, this would use Redis
  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    // Cleanup expired entries every minute
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 60 * 1000);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isProduction) {
      // In production, use Redis
      return this.getFromRedis<T>(key);
    }

    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  async set(key: string, data: any, ttl: number = this.defaultTTL): Promise<void> {
    if (this.isProduction) {
      // In production, use Redis
      return this.setInRedis(key, data, ttl);
    }

    const entry: CacheEntry = {
      data,
      expiresAt: Date.now() + ttl,
    };

    this.cache.set(key, entry);
  }

  async delete(key: string): Promise<void> {
    if (this.isProduction) {
      // In production, use Redis
      return this.deleteFromRedis(key);
    }

    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    if (this.isProduction) {
      // In production, use Redis
      return this.clearRedis();
    }

    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Redis methods (placeholder - would implement actual Redis client)
  private async getFromRedis<T>(key: string): Promise<T | null> {
    try {
      // Implementation would use ioredis or similar
      console.log(`Redis GET: ${key}`);
      return null; // Placeholder
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  private async setInRedis(key: string, data: any, ttl: number): Promise<void> {
    try {
      // Implementation would use ioredis or similar
      console.log(`Redis SET: ${key}, TTL: ${ttl}`);
      // Placeholder
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  private async deleteFromRedis(key: string): Promise<void> {
    try {
      // Implementation would use ioredis or similar
      console.log(`Redis DELETE: ${key}`);
      // Placeholder
    } catch (error) {
      console.error('Redis DELETE error:', error);
    }
  }

  private async clearRedis(): Promise<void> {
    try {
      // Implementation would use ioredis or similar
      console.log('Redis CLEAR');
      // Placeholder
    } catch (error) {
      console.error('Redis CLEAR error:', error);
    }
  }

  // Cache utility methods
  async getProducts(categoryId?: string, page: number = 1, limit: number = 20): Promise<any[] | null> {
    const cacheKey = `products:${categoryId || 'all'}:${page}:${limit}`;
    return this.get(cacheKey);
  }

  async setProducts(categoryId: string | undefined, page: number, limit: number, products: any[]): Promise<void> {
    const cacheKey = `products:${categoryId || 'all'}:${page}:${limit}`;
    const ttl = 10 * 60 * 1000; // 10 minutes for products
    return this.set(cacheKey, products, ttl);
  }

  async getProduct(productId: string): Promise<any | null> {
    const cacheKey = `product:${productId}`;
    return this.get(cacheKey);
  }

  async setProduct(productId: string, product: any): Promise<void> {
    const cacheKey = `product:${productId}`;
    const ttl = 30 * 60 * 1000; // 30 minutes for single product
    return this.set(cacheKey, product, ttl);
  }

  async getCategories(): Promise<any[] | null> {
    const cacheKey = 'categories:all';
    return this.get(cacheKey);
  }

  async setCategories(categories: any[]): Promise<void> {
    const cacheKey = 'categories:all';
    const ttl = 60 * 60 * 1000; // 1 hour for categories
    return this.set(cacheKey, categories, ttl);
  }

  async getUserOrders(userId: string): Promise<any[] | null> {
    const cacheKey = `user_orders:${userId}`;
    return this.get(cacheKey);
  }

  async setUserOrders(userId: string, orders: any[]): Promise<void> {
    const cacheKey = `user_orders:${userId}`;
    const ttl = 5 * 60 * 1000; // 5 minutes for user orders
    return this.set(cacheKey, orders, ttl);
  }

  async getFeaturedProducts(): Promise<any[] | null> {
    const cacheKey = 'featured_products';
    return this.get(cacheKey);
  }

  async setFeaturedProducts(products: any[]): Promise<void> {
    const cacheKey = 'featured_products';
    const ttl = 15 * 60 * 1000; // 15 minutes for featured products
    return this.set(cacheKey, products, ttl);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (this.isProduction) {
      // In production, use Redis pattern deletion
      console.log(`Redis INVALIDATE PATTERN: ${pattern}`);
      return;
    }

    // In memory, delete matching keys
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Cache invalidation methods
  async invalidateProduct(productId: string): Promise<void> {
    await this.invalidatePattern(`product:${productId}`);
    await this.invalidatePattern('products:'); // Invalidate product lists
  }

  async invalidateCategory(categoryId: string): Promise<void> {
    await this.invalidatePattern(`products:${categoryId}`);
    await this.invalidatePattern('categories:all');
  }

  async invalidateUserOrders(userId: string): Promise<void> {
    await this.invalidatePattern(`user_orders:${userId}`);
  }

  async invalidateAllProducts(): Promise<void> {
    await this.invalidatePattern('products:');
    await this.invalidatePattern('featured_products');
  }

  async invalidateAllCategories(): Promise<void> {
    await this.invalidatePattern('categories:');
  }

  // Cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Global cache instance
export const cache = new CacheService();

// Cache middleware helper
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  return cache.get<T>(key).then(cached => {
    if (cached !== null) {
      return cached;
    }

    return fetcher().then(data => {
      cache.set(key, data, ttl);
      return data;
    });
  });
}

export default CacheService;
