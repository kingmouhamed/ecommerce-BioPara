// =================================
// VALIDATION TYPES
// =================================

import { z } from 'zod';

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export interface ValidationSchema {
  [key: string]: z.ZodType<any>;
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number'),
  postal_code: z.string().min(3, 'Postal code is required'),
};
