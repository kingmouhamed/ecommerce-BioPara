import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  categories: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    slug: string;
    created_at: string;
  };
  products: {
    id: string;
    name: string;
    description: string;
    long_description: string | null;
    price: number;
    category_id: string;
    image_url: string;
    images: string[];
    stock_quantity: number;
    sku: string | null;
    benefits: string[];
    usage_instructions: string | null;
    ingredients: string | null;
    rating: number;
    review_count: number;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  reviews: {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    helpful_count: number;
    created_at: string;
    updated_at: string;
  };
  favorites: {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
  };
  cart_items: {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
  };
  orders: {
    id: string;
    user_id: string;
    order_number: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shipping_address: string;
    payment_method: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
};
