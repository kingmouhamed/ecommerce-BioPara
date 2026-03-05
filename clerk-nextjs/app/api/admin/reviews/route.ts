// =================================
// ADMIN REVIEWS API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { ReviewsService } from '@/lib/services/reviews';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Authenticate and check admin role
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as 'pending' | 'approved' | 'all' || 'all';

    // Get all reviews (admin)
    const result = await ReviewsService.getAllReviews(page, limit, status);

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
    console.error('Admin Reviews API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate and check admin role
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { reviewId, approved } = body;

    // Moderate review
    const result = await ReviewsService.moderateReview(reviewId, approved);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.review,
      message: `Review ${approved ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    console.error('Admin Reviews API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
