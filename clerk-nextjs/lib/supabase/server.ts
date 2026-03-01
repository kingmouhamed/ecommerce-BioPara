import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error('❌ Missing env.NEXT_PUBLIC_SUPABASE_URL')
if (!supabaseServiceKey) console.warn('⚠️ Missing env.SUPABASE_SERVICE_ROLE_KEY - Using RLS bypassing might fail!')

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          name_ar: string
          slug: string
          description: string | null
          description_ar: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          name_ar: string
          slug: string
          description?: string | null
          description_ar?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_ar?: string
          slug?: string
          description?: string | null
          description_ar?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          name_ar: string
          slug: string
          description: string
          description_ar: string
          price: number
          currency: string
          stock: number
          images: string[]
          category_id: number
          is_active: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          name_ar: string
          slug: string
          description: string
          description_ar: string
          price: number
          currency?: string
          stock?: number
          images?: string[]
          category_id: number
          is_active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_ar?: string
          slug?: string
          description?: string
          description_ar?: string
          price?: number
          currency?: string
          stock?: number
          images?: string[]
          category_id?: number
          is_active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
