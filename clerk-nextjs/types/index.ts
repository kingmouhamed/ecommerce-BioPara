export interface Category {
    id: string;
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    image: string;
    icon?: string;
    productCount?: number;
    subcategories?: Subcategory[];
    seoTitle?: string;
    seoDescription?: string;
}

export interface Subcategory {
    id: string;
    name: string;
    nameAr: string;
    slug: string;
    description?: string;
    descriptionAr?: string;
    image?: string;
    productCount?: number;
}

export interface Product {
    id: string | number;
    title: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    category: string;
    subcategory?: string;
    brand?: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    stockCount?: number;
    best_seller?: boolean;
    sales_count?: number;
    badge?: string;
    tags?: string[];
    specifications?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

export type ProductCardData = {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    image: string;
    category: string;
    badge?: string;
    brand?: string;
};
