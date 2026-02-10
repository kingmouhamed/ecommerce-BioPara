import { parapharmacieProducts } from './parapharmacie-images';
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
  type: 'para' | 'herbal';
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
  description: product.description || '' // Provide default description
});

// 1. تصدير المنتجات منفصلة (لمن يحتاجها منفصلة)
export const parapharmacieProductsUnified: Product[] = parapharmacieProducts.map(convertToUnifiedProduct);
export const herbalProductsUnified: Product[] = herbalProducts.map(convertToUnifiedProduct);

// 2. تصدير الكل معاً (للصفحات التي تعرض كل شيء مثل البحث)
export const allProducts = [
  ...parapharmacieProductsUnified,
  ...herbalProductsUnified
];

// 3. للتوافق مع الاستيرادات القديمة
export { parapharmacieProductsUnified as parapharmacieProducts };
export { herbalProductsUnified as herbalProducts };