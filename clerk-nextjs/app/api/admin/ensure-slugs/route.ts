import { NextResponse } from 'next/server'
import { ensureProductSlugs } from '@/lib/data/products'
import { auth } from '@clerk/nextjs/server'

export async function POST() {
  try {
    // Verify admin authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Add admin role check here if needed

    // Ensure all products have slugs
    await ensureProductSlugs()

    return NextResponse.json({
      success: true,
      message: 'Product slugs have been updated successfully'
    })
  } catch (error) {
    console.error('Error ensuring product slugs:', error)
    return NextResponse.json(
      { error: 'Failed to update product slugs' },
      { status: 500 }
    )
  }
}
