// =================================
// ORDERS API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { OrdersService } from '@/lib/services/orders';
import { validateOrderData } from '@/lib/utils/orders';
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
    
    // Validate order data
    const validation = validateOrderData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data', details: validation.errors },
        { status: 400 }
      );
    }

    // Create order
    const result = await OrdersService.createOrder({
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
      data: {
        order: result.order,
        payment_intent: result.payment_intent,
      },
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
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
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user orders
    const result = await OrdersService.getUserOrders(userId, page, limit);

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
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
