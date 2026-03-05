import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

// Get supabase client
const supabaseAdmin = getSupabaseAdmin()

export async function GET() {
  try {
    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('products')
      .select('count')
      .limit(1)

    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message
      }, { status: 500 })
    }

    // Check if products table exists and get structure
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .limit(5)

    // Check if categories table exists
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .limit(5)

    // Get total counts
    const { count: productsCount, error: countError } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })

    const { count: categoriesCount } = await supabaseAdmin
      .from('categories')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        products: {
          exists: !productsError,
          count: productsCount || 0,
          sample: products?.slice(0, 3) || [],
          error: productsError?.message
        },
        categories: {
          exists: !categoriesError,
          count: categoriesCount || 0,
          sample: categories?.slice(0, 3) || [],
          error: categoriesError?.message
        }
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
