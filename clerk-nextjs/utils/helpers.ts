import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tables } from "../lib/supabase-client";
import { ProductCardData } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mapper function to transform Supabase product to ProductCard format
export function mapProductToCardData(product: Tables['products'], categoryName?: string): ProductCardData {
  return {
    id: parseInt(product.id, 10),
    title: product.name,
    price: product.price,
    originalPrice: undefined, // Can be calculated if there's a sale price
    rating: product.rating,
    image: product.image_url,
    category: categoryName || product.category_id,
    badge: undefined, // Can be set based on product attributes
    brand: undefined, // Can be set based on product attributes
  };
}
