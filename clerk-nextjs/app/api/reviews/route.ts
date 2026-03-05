// =================================
// REVIEWS API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { ReviewsService } from '@/lib/services/reviews';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Create review
    const result = await ReviewsService.createReview({
      ...body,
      user_id: userId,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.review,
      message: 'Review created successfully',
    });
  } catch (error) {
    console.error('Reviews API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined;
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc';

    let result;

    if (productId) {
      // Get product reviews
      result = await ReviewsService.getProductReviews(
        productId,
        page,
        limit,
        rating,
        sortBy,
        sortOrder
      );
    } else if (userId) {
      // Authenticate user for their own reviews
      const { userId: authUserId } = await auth();
      if (!authUserId || authUserId !== userId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Get user reviews
      result = await ReviewsService.getUserReviews(userId, page, limit);
    } else {
      return NextResponse.json(
        { success: false, error: 'Product ID or User ID is required' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
      message: 'Reviews retrieved successfully',
    });
  } catch (error) {
    console.error('Reviews API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
