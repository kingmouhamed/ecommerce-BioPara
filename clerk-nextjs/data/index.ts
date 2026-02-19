import { herbalProducts } from './herbal-images';

// Unified Product interface
export interface Product {
  id: number;
  title: string;
  name: string; // مطلوب للتوافق
  price: number;
  originalPrice?: number;
  oldPrice?: number; // للتوافق
  rating: number;
  image: string;
  category: string;
  badge?: string;
  type: 'herbal';
  isNew?: boolean;
  description: string; // Make required
  brand?: string;
  inStock?: boolean;
  reviews?: number; // للتوافق - تغيير من number[] إلى number
  origin?: string; // للأعشاب فقط
  benefit?: string; // للأعشاب فقط
}

// Convert products to unified format
const convertToUnifiedProduct = (product: any): Product => ({
  ...product,
  name: product.title, // استخدام title كـ name
  oldPrice: product.originalPrice || product.oldPrice,
  reviews: product.reviews || 0, // تغيير من [] إلى 0
  description: product.description || '', // Provide default description
  type: 'herbal' // All products are now herbal
});

// Export only herbal products
export const herbalProductsUnified: Product[] = herbalProducts.map(convertToUnifiedProduct);

// For compatibility with existing imports
export const allProducts = herbalProductsUnified;
export { herbalProductsUnified as herbalProducts };