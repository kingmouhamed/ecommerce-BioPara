import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/data/products'
import { generateSlug } from '@/lib/utils/slug'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured') === 'true'

    const minPriceStr = searchParams.get('minPrice')
    const maxPriceStr = searchParams.get('maxPrice')
    const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined
    const inStock = searchParams.get('inStock') === 'true'

    const productsData = await getProducts({
      query,
      category,
      page,
      limit,
      featured,
      minPrice,
      maxPrice,
      inStock
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

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || body.price === undefined || !body.category_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, price, category_id)' },
        { status: 400 }
      )
    }

    // 2. Create the product
    const product = await createProduct({
      name: body.name,
      name_ar: body.name_ar || body.name,
      description: body.description || '',
      description_ar: body.description_ar || body.description || '',
      price: parseFloat(body.price),
      currency: body.currency || 'MAD',
      stock: parseInt(body.stock || '0', 10),
      images: body.images || [],
      category_id: body.category_id,
      is_active: body.is_active !== undefined ? body.is_active : true,
      featured: body.featured !== undefined ? body.featured : false,
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('🚨 POST /api/products Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
