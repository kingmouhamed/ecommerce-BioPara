import { createClient } from '../lib/supabase-client';
import { Product, Category } from '../types';

/**
 * Service Layer for Supabase data fetching
 * Centralizes all core database operations away from the components.
 */

// Initialize the standard client
const supabase = createClient();

// Example functions that can be used across the app

export async function fetchAllProducts(): Promise<Product[] | null> {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error('Error fetching products', error);
        return null;
    }
    return data as Product[];
}

export async function fetchProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching product id', id, error);
        return null;
    }
    return data as Product;
}

export async function fetchCategories(): Promise<Category[] | null> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories', error);
        return null;
    }
    return data as Category[];
}
