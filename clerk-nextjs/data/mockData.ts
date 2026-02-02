// بيانات تجريبية للفئات
export interface Category {
  name: string;
  count: number;
}

export const categories: Category[] = [
  { name: "Cosmétique", count: 120 },
  { name: "Compléments", count: 45 },
  { name: "Huiles Essentielles", count: 30 },
  { name: "Hygiène", count: 85 },
  { name: "Miel & Ruche", count: 20 },
];

// بيانات تجريبية للمنتجات
export interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge: string | null;
  category: string;
}

export const mockProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: i % 2 === 0 ? "Huile d'Argan Bio Premium" : "Crème Hydratante Visage",
  price: (i + 1) * 50 + 99,
  oldPrice: (i + 1) * 50 + 150,
  rating: 4.5,
  reviews: 12 + i,
  image: i % 2 === 0 
    ? "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=600" 
    : "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600",
  badge: i === 0 ? "Nouveau" : i === 3 ? "-20%" : null,
  category: "Cosmétique"
}));

// التصدير الافتراضي للتوافق
export default {
  categories,
  mockProducts
};
