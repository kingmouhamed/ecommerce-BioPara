import { supabase } from '../lib/supabase-client';
import { Product, Category } from '../types';

/**
 * Service Layer for Supabase data fetching
 * Centralizes all core database operations away from the components.
 */

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

export async function getMixedBestSellers(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        // Order by sales count first, then rating as fallback
        .order('sales_count', { ascending: false, nullsFirst: false })
        .order('rating', { ascending: false })
        .limit(50); // Fetch a larger pool to allow diverse mixing

    if (error || !data) {
        console.error('Error fetching best sellers from Supabase', error);
        return [];
    }

    // Group by the 3 target categories
    const herbs = data.filter(p => p.category === 'herbs' || p.category.includes('herb'));
    const oils = data.filter(p => p.category === 'oils' || p.category.includes('oil'));
    const supplements = data.filter(p => p.category === 'supplements' || p.category.includes('supplement'));

    const mixed: Product[] = [];
    const usedIds = new Set();

    const addProduct = (sourceArray: Product[]) => {
        for (const p of sourceArray) {
            if (!usedIds.has(p.id)) {
                mixed.push(p);
                usedIds.add(p.id);
                return true;
            }
        }
        return false;
    };

    // 1. Ensure at least one product from each category if available
    addProduct(herbs);
    addProduct(oils);
    addProduct(supplements);

    // 2. Fill the rest up to the requested 'limit', alternating to maintain diversity
    let added = true;
    while (mixed.length < limit && added) {
        added = false;
        if (mixed.length < limit) added = addProduct(herbs) || added;
        if (mixed.length < limit) added = addProduct(oils) || added;
        if (mixed.length < limit) added = addProduct(supplements) || added;

        // If we still need more and specific categories are exhausted, just add from the general top-sellers pool
        if (!added && mixed.length < limit) {
            for (const p of data) {
                if (!usedIds.has(p.id)) {
                    mixed.push(p);
                    usedIds.add(p.id);
                    added = true;
                    if (mixed.length >= limit) break;
                }
            }
        }
    }

    // Return dynamically mixed top products
    return mixed.sort(() => 0.5 - Math.random());
}
