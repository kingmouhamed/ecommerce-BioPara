import { supabaseServer } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/server'

export type Product = Database['public']['Tables']['products']['Row'] & {
  categories?: {
    id: number
    name: string
    name_ar: string
    slug: string
  }
}
export type Category = Database['public']['Tables']['categories']['Row']

export interface ProductFilters {
  query?: string
  category?: string
  page?: number
  limit?: number
  featured?: boolean
  active?: boolean
}

export interface PaginatedProducts {
  products: Product[]
  categories: Category[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * جلب جميع المنتجات مع الفلترة والبحث
 */
export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  try {
    const {
      query = '',
      category = '',
      page = 1,
      limit = 12,
      featured = false,
      active = true
    } = filters

    // Validate inputs
    if (page < 1) throw new Error('Page must be greater than 0')
    if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100')

    const selectStatement = category
      ? `*, categories!inner(id, name, name_ar, slug)`
      : `*, categories(id, name, name_ar, slug)`

    let queryBuilder = supabaseServer
      .from('products')
      .select(selectStatement, { count: 'exact' })
      .eq('is_active', active)

    // فلترة حسب الفئة
    if (category) {
      queryBuilder = queryBuilder.eq('categories.slug', category)
    }

    // فلترة حسب المميزة
    if (featured) {
      queryBuilder = queryBuilder.eq('featured', true)
    }

    // البحث في الاسم والوصف
    if (query && query.trim()) {
      const searchTerm = query.trim()
      queryBuilder = queryBuilder.or(
        `name.ilike.%${searchTerm}%,name_ar.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,description_ar.ilike.%${searchTerm}%`
      )
    }

    // الترتيب والتقسيم
    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    const { data: products, error, count } = await queryBuilder

    if (error) {
      console.error('❌ Supabase query error in getProducts:', error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    // جلب الفئات
    const { data: categories, error: categoriesError } = await supabaseServer
      .from('categories')
      .select('*')
      .order('name')

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError)
      // Don't throw here, just log and continue with empty categories
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    return {
      products: products || [],
      categories: categories || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error in getProducts:', error)

    // Return safe fallback data
    return {
      products: [],
      categories: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }
}

/**
 * جلب منتج واحد حسب الـ slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (!slug || typeof slug !== 'string') {
      console.warn('Invalid slug provided to getProductBySlug:', slug)
      return null
    }

    const { data, error } = await supabaseServer
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          name_ar,
          slug
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('❌ Error fetching product by slug:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('💥 Unexpected error in getProductBySlug:', error)
    return null
  }
}

/**
 * جلب المنتجات المميزة
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    if (limit < 1 || limit > 50) {
      console.warn('Invalid limit for getFeaturedProducts:', limit)
      limit = 8
    }

    const { data, error } = await supabaseServer
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          name_ar,
          slug
        )
      `)
      .eq('featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ Error fetching featured products:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('💥 Unexpected error in getFeaturedProducts:', error)
    return []
  }
}

/**
 * جلب المنتجات حسب الفئة
 */
export async function getProductsByCategory(
  categorySlug: string,
  page = 1,
  limit = 12
): Promise<PaginatedProducts> {
  return getProducts({
    category: categorySlug,
    page,
    limit
  })
}

/**
 * البحث عن المنتجات
 */
export async function searchProducts(
  searchQuery: string,
  page = 1,
  limit = 12
): Promise<PaginatedProducts> {
  return getProducts({
    query: searchQuery,
    page,
    limit
  })
}
