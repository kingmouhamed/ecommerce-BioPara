import { Category } from './products'
import { getSupabaseAdmin } from '../supabase-server'

/**
 * جلب جميع الفئات
 */
export async function getCategories(): Promise<Category[]> {
  try {
    // Try to get from database first
    const supabaseAdmin = getSupabaseAdmin()
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.warn('⚠️ Database not configured - Using demo data')
      throw error
    }

    return data || []
  } catch (error) {
    console.warn('⚠️ Database not configured - Using demo data')
    // Fallback to demo data
    const { demoCategories } = await import('./demo-data')
    return demoCategories
  }
}

/**
 * جلب فئة واحدة حسب الـ slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    // Try database first
    const supabaseAdmin = getSupabaseAdmin()
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('slug', slug.toLowerCase()) // Case-insensitive search
      .single()

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.warn('⚠️ Database not configured - Using demo data')
      }
      throw error
    }

    return data
  } catch (error) {
    console.warn('⚠️ Database not configured - Using demo data')
    // Fallback to demo data
    const { demoCategories } = await import('./demo-data')
    return demoCategories.find(c => 
      c.slug.toLowerCase() === slug.toLowerCase() || 
      c.name.toLowerCase() === slug.toLowerCase() ||
      c.name_ar.toLowerCase() === slug.toLowerCase()
    ) || null
  }
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

  try {
    // Try database first
    const supabaseAdmin = getSupabaseAdmin()
    
    const offset = (page - 1) * limit
    
    const { data: products, error, count } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.warn('⚠️ Database not configured - Using demo data')
      throw error
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
  } catch (error) {
    console.warn('⚠️ Database not configured - Using demo data')
    // Fallback to demo data
    const { demoProducts } = await import('./demo-data')
    const products = demoProducts.filter(p => 
      p.category_id === category.id && 
      p.is_active
    )
    const totalCount = products.length
    const totalPages = Math.ceil(totalCount / limit)
    const paginatedProducts = products.slice((page - 1) * limit, page * limit)

    return {
      category,
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  }
}
