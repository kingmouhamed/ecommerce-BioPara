// =================================
// ADMIN ORDERS API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { OrdersService } from '@/lib/services/orders';
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
    const status = searchParams.get('status') || undefined;

    // Get all orders (admin)
    const result = await OrdersService.getAllOrders(page, limit, status);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    console.error('Admin Orders API Error:', error);
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
    const { orderId, action, ...updateData } = body;

    let result;

    switch (action) {
      case 'update_status':
        result = await OrdersService.updateOrderStatus(
          orderId,
          updateData.status,
          updateData.trackingNumber,
          updateData.trackingUrl
        );
        break;

      case 'cancel':
        result = await OrdersService.cancelOrder(orderId, updateData.reason);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
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
      data: result.order,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Admin Orders API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
