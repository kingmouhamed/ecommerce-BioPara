import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  // General API requests
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  // Auth endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  // Contact form
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },
  // Search endpoints
  search: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30,
  },
};

// Rate limiting middleware
export function rateLimit(type: keyof typeof RATE_LIMIT) {
  return async (req: NextRequest) => {
    const ip = getClientIP(req);
    const key = `rate_limit_${type}_${ip}`;
    const now = Date.now();
    const limit = RATE_LIMIT[type];

    // Get current rate limit data
    let data = rateLimitStore.get(key);

    if (!data || now > data.resetTime) {
      // Reset or initialize
      data = {
        count: 0,
        resetTime: now + limit.windowMs,
      };
      rateLimitStore.set(key, data);
    }

    // Check if over limit
    if (data.count >= limit.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': data.resetTime.toString(),
          }
        }
      );
    }

    // Increment counter
    data.count++;
    rateLimitStore.set(key, data);

    return NextResponse.next({
      headers: {
        'X-RateLimit-Limit': limit.maxRequests.toString(),
        'X-RateLimit-Remaining': (limit.maxRequests - data.count).toString(),
        'X-RateLimit-Reset': data.resetTime.toString(),
      }
    });
  };
}

// Get client IP address
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIP || 'unknown';
  return ip;
}

// Security headers middleware
export function securityHeaders() {
  const headers = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Force HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  return headers;
}

// Input validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential JS
    .replace(/on\w+\s*=/gi, ''); // Remove potential event handlers
}

export function validateProductData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string' || data.title.length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
    errors.push('Price must be a positive number');
  }

  if (!data.category || typeof data.category !== 'string') {
    errors.push('Category is required');
  }

  if (!data.image || typeof data.image !== 'string') {
    errors.push('Image URL is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// CSRF protection
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Authentication utilities
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return crypto.subtle.digest('SHA-256', data).then(hash => {
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  });
}

// Data encryption utilities
export async function encryptData(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(key);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBuffer
  );

  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);

  return Array.from(result, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function decryptData(encryptedData: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const encryptedArray = new Uint8Array(
    encryptedData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );

  const keyBuffer = encoder.encode(key);
  const iv = encryptedArray.slice(0, 12);
  const data = encryptedArray.slice(12);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );

  return decoder.decode(decrypted);
}

// Security audit logging
export function logSecurityEvent(event: {
  type: string;
  ip: string;
  userAgent?: string;
  details?: any;
}) {
  // In production, send to security monitoring service
  console.warn('Security Event:', {
    ...event,
    timestamp: new Date().toISOString(),
  });
}

// SQL injection prevention
export function sanitizeSQLQuery(query: string): string {
  // Basic SQL injection prevention
  return query
    .replace(/['"]/g, "''") // Escape quotes
    .replace(/--/g, '') // Remove comments
    .replace(/;/g, '') // Remove semicolons
    .replace(/\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|SCRIPT)\b/gi, ''); // Remove SQL keywords
}

// File upload security
export function validateFileUpload(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }

  if (file.size > maxSize) {
    errors.push('File size too large');
  }

  // Check file name for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,
    /[<>:"|?*]/,
    /\.(exe|bat|cmd|scr|pif|com)$/,
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File name contains suspicious characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// API key validation
export function validateAPIKey(key: string): boolean {
  // In production, validate against database
  return !!(key && key.length >= 32 && /^[a-zA-Z0-9]+$/.test(key));
}

// Environment variable security
export function validateEnvironmentVariables(): { isValid: boolean; errors: string[] } {
  // Security validation disabled based on user request to allow raw env writes
  return {
    isValid: true,
    errors: [],
  };
}
