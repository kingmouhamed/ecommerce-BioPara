// =================================
// INPUT VALIDATION SCHEMAS
// =================================

import { z } from 'zod';

// =================================
// PRODUCT SCHEMAS
// =================================

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name too long'),
  slug: z.string().min(1, 'Product slug is required').max(255, 'Product slug too long'),
  description: z.string().optional(),
  short_description: z.string().max(500, 'Short description too long').optional(),
  sku: z.string().min(1, 'SKU is required').max(100, 'SKU too long'),
  price: z.number().min(0, 'Price must be positive'),
  original_price: z.number().min(0, 'Original price must be positive').optional(),
  cost_price: z.number().min(0, 'Cost price must be positive').optional(),
  stock_quantity: z.number().int().min(0, 'Stock quantity must be non-negative'),
  min_stock_level: z.number().int().min(0, 'Min stock level must be non-negative').optional(),
  weight: z.number().min(0, 'Weight must be positive').optional(),
  category_id: z.string().uuid('Invalid category ID'),
  brand: z.string().max(100, 'Brand name too long').optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    alt: z.string().optional(),
    order: z.number().int().min(0).optional(),
  })).max(10, 'Too many images').optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  seo_title: z.string().max(255, 'SEO title too long').optional(),
  seo_description: z.string().max(500, 'SEO description too long').optional(),
  status: z.enum(['active', 'inactive', 'draft', 'archived']),
  is_featured: z.boolean().optional(),
  is_digital: z.boolean().optional(),
  requires_shipping: z.boolean().optional(),
  tax_class: z.string().max(50, 'Tax class too long').optional(),
});

export const updateProductSchema = createProductSchema.partial();

// =================================
// ORDER SCHEMAS
// =================================

export const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unit_price: z.number().min(0, 'Unit price must be positive'),
  })).min(1, 'Order must contain at least one item'),
  shipping_address_id: z.string().uuid('Invalid shipping address ID'),
  billing_address_id: z.string().uuid('Invalid billing address ID').optional(),
  currency: z.string().length(3, 'Invalid currency').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  tracking_number: z.string().max(100, 'Tracking number too long').optional(),
  tracking_url: z.string().url('Invalid tracking URL').optional(),
});

// =================================
// REVIEW SCHEMAS
// =================================

export const createReviewSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Review title is required').max(255, 'Review title too long').optional(),
  content: z.string().min(10, 'Review content must be at least 10 characters').max(2000, 'Review content too long').optional(),
  images: z.array(z.string().url('Invalid image URL')).max(5, 'Too many review images').optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

// =================================
// USER SCHEMAS
// =================================

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  date_of_birth: z.string().datetime('Invalid date of birth').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
  preferences: z.record(z.string(), z.any()).optional(),
  marketing_consent: z.boolean().optional(),
});

// =================================
// ADDRESS SCHEMAS
// =================================

export const createAddressSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  company: z.string().max(100, 'Company name too long').optional(),
  address_line_1: z.string().min(1, 'Address line 1 is required').max(255, 'Address line 1 too long'),
  address_line_2: z.string().max(255, 'Address line 2 too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City too long'),
  state_province: z.string().max(100, 'State/province too long').optional(),
  postal_code: z.string().min(1, 'Postal code is required').max(20, 'Postal code too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country too long'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  is_default: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

// =================================
// CART SCHEMAS
// =================================

export const addToCartSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateCartItemSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// =================================
// CATEGORY SCHEMAS
// =================================

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Category name too long'),
  slug: z.string().min(1, 'Category slug is required').max(255, 'Category slug too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  image_url: z.string().url('Invalid image URL').optional(),
  parent_id: z.string().uuid('Invalid parent category ID').optional(),
  sort_order: z.number().int().min(0, 'Sort order must be non-negative').optional(),
  is_active: z.boolean().optional(),
  meta_title: z.string().max(255, 'Meta title too long').optional(),
  meta_description: z.string().max(500, 'Meta description too long').optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// =================================
// SEARCH SCHEMAS
// =================================

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(255, 'Search query too long'),
  category_id: z.string().uuid('Invalid category ID').optional(),
  min_price: z.number().min(0, 'Minimum price must be non-negative').optional(),
  max_price: z.number().min(0, 'Maximum price must be non-negative').optional(),
  brands: z.array(z.string()).max(10, 'Too many brands').optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
  sort_by: z.enum(['name', 'price', 'created_at', 'rating', 'popularity']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1, 'Page must be at least 1').optional(),
  limit: z.number().int().min(1).max(100, 'Limit must be between 1 and 100').optional(),
});

// =================================
// PAYMENT SCHEMAS
// =================================

export const createPaymentIntentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be at least 0.01'),
  currency: z.string().length(3, 'Invalid currency').optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  customer: z.string().optional(),
  payment_method: z.string().optional(),
  confirmation_method: z.enum(['automatic', 'manual']).optional(),
  capture_method: z.enum(['automatic', 'manual']).optional(),
});

export const shippingRateRequestSchema = z.object({
  from_address: z.object({
    name: z.string(),
    street1: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
  }),
  to_address: z.object({
    name: z.string(),
    street1: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
  }),
  parcels: z.array(z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
    weight: z.number(),
    distance_unit: z.string(),
    mass_unit: z.string(),
  })),
});

export const createCheckoutSessionSchema = z.object({
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    amount: z.number().min(0.01, 'Item amount must be positive'),
    quantity: z.number().int().min(1, 'Item quantity must be at least 1'),
    description: z.string().optional(),
    images: z.array(z.string().url()).optional(),
  })).min(1, 'At least one item is required'),
  success_url: z.string().url('Invalid success URL'),
  cancel_url: z.string().url('Invalid cancel URL'),
  customer_email: z.string().email('Invalid customer email').optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

// =================================
// EMAIL SCHEMAS
// =================================

export const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  from: z.string().email('Invalid from email').optional(),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject too long'),
  html: z.string().optional(),
  text: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message too long'),
});

// =================================
// UTILITY FUNCTIONS
// =================================

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential JavaScript
    .replace(/on\w+=/gi, ''); // Remove potential event handlers
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
