import { getSupabaseAdmin } from '../supabase-server'
import { generateSlug, generateUniqueSlug } from '../utils/slug'
import { demoProducts, demoCategories } from './demo-data'

// Get supabase client
const supabaseAdmin = getSupabaseAdmin()

export type Category = {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description: string | null;
  description_ar: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export type Product = {
  id: string | number;
  name: string;
  name_ar: string;
  slug: string;
  description: string | null;
  description_ar: string | null;
  short_description_ar?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  seo_keywords?: string[] | null;
  price: number;
  currency: string;
  stock: number;
  stock_quantity?: number;
  images: string[] | null;
  image_url?: string;
  category_id: string | number | null;
  is_active?: boolean;
  featured?: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at?: string;
  categories?: {
    id: string | number;
    name: string;
    name_ar: string;
    slug: string;
  };
}

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
 * جلب جميع المنتجات مع الفلترة والبحث من Supabase
 */
export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const {
    query = '',
    category = '',
    page = 1,
    limit = 12,
    featured = false,
    active = true
  } = filters

  try {
    // Try to get data from database first
    const { data: dbCategories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (catError) {
      console.warn('⚠️ Database not configured - Using demo data')
      // Use demo data as fallback
      return getDemoProducts(filters, demoCategories, demoProducts)
    }

    const categories: Category[] = dbCategories || []

    // Try to get products from database
    let queryBuilder = supabaseAdmin
      .from('products')
      .select('*, categories(id, name, name_ar, slug)', { count: 'exact' })

    // Try different column names for active status
    if (active) {
      queryBuilder = queryBuilder.or('is_active.eq.true,is_active.is.null')
    }

    if (featured) {
      queryBuilder = queryBuilder.or('featured.eq.true,is_featured.eq.true')
    }

    if (category && categories.length > 0) {
      const cat = categories.find(c => c.slug === category)
      if (cat) {
        queryBuilder = queryBuilder.eq('category_id', cat.id)
      } else {
        console.warn('⚠️ Category not found in DB - Using demo data')
        return getDemoProducts(filters, demoCategories, demoProducts)
      }
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim()
      queryBuilder = queryBuilder.or(`name.ilike.%${q}%,name_ar.ilike.%${q}%,description.ilike.%${q}%,description_ar.ilike.%${q}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    queryBuilder = queryBuilder.range(from, to).order('created_at', { ascending: false })

    const { data: productsData, error: prodError, count } = await queryBuilder

    if (prodError || !productsData || productsData.length === 0) {
      console.warn('⚠️ Database empty or error - Using demo data')
      return getDemoProducts(filters, demoCategories, demoProducts)
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    return {
      products: productsData as Product[],
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.max(1, totalPages),
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  } catch (error) {
    console.warn('⚠️ Database not configured - Using demo data')
    // Use demo data as fallback
    return getDemoProducts(filters, demoCategories, demoProducts)
  }
}

// Helper function to filter demo products
function getDemoProducts(filters: ProductFilters, categories: Category[], products: Product[]): PaginatedProducts {
  const { query = '', category = '', page = 1, limit = 12, featured = false } = filters

  let filteredProducts = [...products]

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p =>
      categories.find(c => c.slug === category && p.category_id === c.id)
    )
  }

  // Filter by search query
  if (query) {
    const q = query.toLowerCase()
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.name_ar.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.description_ar && p.description_ar.toLowerCase().includes(q))
    )
  }

  // Filter by featured
  if (featured) {
    filteredProducts = filteredProducts.filter(p => p.featured)
  }

  // Pagination
  const totalCount = filteredProducts.length
  const totalPages = Math.ceil(totalCount / limit)
  const from = (page - 1) * limit
  const to = from + limit
  const paginatedProducts = filteredProducts.slice(from, to)

  return {
    products: paginatedProducts,
    categories,
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, totalPages),
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  }
}

/**
 * جلب منتج واحد بالـ Slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalizedSlug = slug.toLowerCase()

  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(id, name, name_ar, slug)')
      .eq('slug', normalizedSlug) // Case-insensitive search
      .or('is_active.eq.true,is_active.is.null')
      .single()

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.warn('⚠️ Database not configured - Using demo data for product:', slug)
      }
      throw error
    }

    if (!data) {
      // Try demo data as fallback
      return demoProducts.find(p =>
        p.slug.toLowerCase() === normalizedSlug ||
        p.name.toLowerCase() === normalizedSlug ||
        p.name_ar.toLowerCase() === normalizedSlug
      ) || null
    }

    return data as Product
  } catch (err) {
    console.warn('⚠️ Database not configured - Using demo data for product:', slug)
    // Try demo data as fallback
    return demoProducts.find(p =>
      p.slug.toLowerCase() === normalizedSlug ||
      p.name.toLowerCase() === normalizedSlug ||
      p.name_ar.toLowerCase() === normalizedSlug
    ) || null
  }
}

/**
 * دالة ذكية تقبل ID أو Slug وتجلب المنتج (مهمة للـ Redirect)
 */
export async function getProductByParam(param: string): Promise<Product | null> {
  try {
    // Check if the param is a number (ID)
    const isId = /^\d+$/.test(param)

    let query = supabaseAdmin
      .from('products')
      .select('*, categories(id, name, name_ar, slug)')
      .eq('is_active', true)

    if (isId) {
      query = query.eq('id', parseInt(param, 10))
    } else {
      query = query.eq('slug', param)
    }

    const { data, error } = await query.single()

    if (error || !data) return null
    return data as Product
  } catch (err) {
    console.error(`Error fetching product by param: ${param}`, err)
    return null
  }
}

/**
 * جلب المنتجات المميزة
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const result = await getProducts({ featured: true, limit, page: 1 })
  return result.products
}

/**
 * جلب المنتجات حسب الفئة
 */
export async function getProductsByCategory(
  categorySlug: string,
  page = 1,
  limit = 12
): Promise<PaginatedProducts> {
  return getProducts({ category: categorySlug, page, limit })
}

/**
 * Ensure all products have slugs - run this to update existing products
 */
export async function ensureProductSlugs(): Promise<void> {
  try {
    // Get all products without slugs
    const { data: productsWithoutSlugs, error } = await supabaseAdmin
      .from('products')
      .select('id, name, name_ar, slug')
      .or('slug.is.null,slug.eq.""')

    if (error) throw error
    if (!productsWithoutSlugs || productsWithoutSlugs.length === 0) return

    // Get existing slugs to avoid conflicts
    const { data: existingProducts } = await supabaseAdmin
      .from('products')
      .select('slug')
      .not('slug', 'is', null)

    const existingSlugs = existingProducts?.map((p: any) => p.slug).filter(Boolean) || []

    // Generate and update slugs
    for (const product of productsWithoutSlugs) {
      const baseText = product.name_ar || product.name
      const slug = generateUniqueSlug(baseText, existingSlugs)

      await supabaseAdmin
        .from('products')
        .update({ slug })
        .eq('id', product.id)

      existingSlugs.push(slug)
    }

    console.log(`Updated ${productsWithoutSlugs.length} products with slugs`)
  } catch (error) {
    console.error('Error ensuring product slugs:', error)
  }
}

/**
 * Create a new product with automatic slug generation
 */
export async function createProduct(productData: Omit<Product, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  try {
    // Get existing slugs to avoid conflicts
    const { data: existingProducts } = await supabaseAdmin
      .from('products')
      .select('slug')
      .not('slug', 'is', null)

    const existingSlugs = existingProducts?.map((p: any) => p.slug).filter(Boolean) || []

    // Generate unique slug
    const baseText = productData.name_ar || productData.name
    const slug = generateUniqueSlug(baseText, existingSlugs)

    // Create product with slug
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        ...productData,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data as Product
  } catch (error) {
    console.error('Error creating product:', error)
    return null
  }
}

/**
 * Update a product and regenerate slug if name changed
 */
export async function updateProduct(
  id: number,
  updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product | null> {
  try {
    let updateData = { ...updates, updated_at: new Date().toISOString() }

    // If name changed, regenerate slug
    if (updates.name || updates.name_ar) {
      const { data: existingProducts } = await supabaseAdmin
        .from('products')
        .select('slug')
        .not('slug', 'is', null)
        .neq('id', id)

      const existingSlugs = existingProducts?.map((p: any) => p.slug).filter(Boolean) || []
      const baseText = updates.name_ar || updates.name || ''
      if (!baseText) return null
      const slug = generateUniqueSlug(baseText, existingSlugs)

      updateData.slug = slug
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  } catch (error) {
    console.error('Error updating product:', error)
    return null
  }
}

/**
 * البحث عن المنتجات
 */
export async function searchProducts(
  searchQuery: string,
  page = 1,
  limit = 12
): Promise<PaginatedProducts> {
  return getProducts({ query: searchQuery, page, limit })
}

