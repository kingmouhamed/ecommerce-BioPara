import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/data/products'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured') === 'true'

    const productsData = await getProducts({
      query,
      category,
      page,
      limit,
      featured
    })

    // Ensure all products have slugs (fallback for missing slugs)
    const productsWithSlugs = productsData.products.map(product => ({
      ...product,
      slug: product.slug || generateSlug(product.name_ar || product.name)
    }))

    const responseData = {
      ...productsData,
      products: productsWithSlugs
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Products fetched successfully'
    })

  } catch (error) {
    console.error('🚨 API Error [/api/products]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
