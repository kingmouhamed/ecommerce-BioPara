/**
 * Slug utility functions for clean URL generation
 */

/**
 * Generate a clean slug from a string
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Handles Arabic text
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace Arabic diacritics and normalize
    .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics
    // Replace spaces and special chars with hyphens
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace multiple spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by checking against existing slugs
 */
export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
  let baseSlug = generateSlug(text);
  let slug = baseSlug;
  let counter = 1;
  
  // If slug already exists, append number
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Validate if a string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  
  // Should contain only lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  // Should not have consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Extract slug from various inputs
 */
export function extractSlug(input: string | number): string {
  if (typeof input === 'number') {
    return input.toString();
  }
  
  return input.toString().trim();
}

/**
 * Compare two slugs for equality (case-insensitive)
 */
export function slugsEqual(slug1: string, slug2: string): boolean {
  return slug1.toLowerCase() === slug2.toLowerCase();
}
