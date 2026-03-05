import { NextRequest, NextResponse } from 'next/server'
import { getCategoryWithProducts } from '@/lib/data/categories'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')

    const categoryData = await getCategoryWithProducts(slug, page)

    if (!categoryData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
          message: 'الفئة غير موجودة'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: categoryData,
      message: 'Category and products fetched successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
