// =================================
// PAYMENTS API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/payments/stripe';
import { OrdersService } from '@/lib/services/orders';
import { EmailService } from '@/lib/services/email';
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
    const { action, ...data } = body;

    let result;

    switch (action) {
      case 'create_payment_intent':
        result = await StripeService.createPaymentIntent(data);
        break;

      case 'confirm_payment':
        result = await StripeService.confirmPaymentIntent(
          data.payment_intent_id,
          data.payment_method_id
        );
        
        // If payment succeeded, update order status
        if (result.success && result.paymentIntent?.status === 'succeeded') {
          await OrdersService.updateOrderStatus(
            result.paymentIntent.metadata.order_id,
            'confirmed'
          );
        }
        break;

      case 'create_checkout_session':
        result = await StripeService.createCheckoutSession(
          data.items,
          data.success_url,
          data.cancel_url,
          data.customer_email
        );
        break;

      case 'refund':
        result = await StripeService.createRefund(
          data.payment_intent_id,
          data.amount,
          data.reason
        );
        
        // If refund succeeded, update payment status
        if (result.success) {
          await OrdersService.updateOrderStatus(
            data.order_id,
            'refunded'
          );
        }
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
      data: (result as any).paymentIntent || (result as any).session || (result as any).refund,
      message: 'Payment operation completed successfully',
    });
  } catch (error) {
    console.error('Payments API Error:', error);
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
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve payment intent
    const result = await StripeService.retrievePaymentIntent(paymentIntentId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.paymentIntent,
      message: 'Payment retrieved successfully',
    });
  } catch (error) {
    console.error('Payments API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
