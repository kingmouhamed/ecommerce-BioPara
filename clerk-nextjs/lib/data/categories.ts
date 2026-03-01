import { supabaseServer } from '@/lib/supabase/server'
import { Category } from './products'

/**
 * جلب جميع الفئات
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

/**
 * جلب فئة واحدة حسب الـ slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

/**
 * جلب فئة مع منتجاتها
 */
export async function getCategoryWithProducts(
  slug: string,
  page = 1,
  limit = 12
) {
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return null
  }

  const { data: products, error, count } = await supabaseServer
    .from('products')
    .select('*', { count: 'exact' })
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) {
    console.error('Error fetching category products:', error)
    return {
      category,
      products: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / limit)

  return {
    category,
    products: products || [],
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  }
}
