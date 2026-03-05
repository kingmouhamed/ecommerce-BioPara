// =================================
// STRIPE WEBHOOK API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/payments/stripe';
import { EmailService } from '@/lib/services/email';
import { getSupabaseAdmin } from '@/lib/supabase-server';

// Get supabase client
const supabaseAdmin = getSupabaseAdmin();

export async function POST(request: NextRequest) {
  try {
    // Handle Stripe webhook
    const { event } = await StripeService.handleWebhook(request);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as any);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as any);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as any);
        break;

      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as any);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    // Update order status
    const { data: order } = await supabaseAdmin
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', paymentIntent.metadata.order_id)
      .select(`
        *,
        users!inner (
          email,
          first_name,
          last_name
        )
      `)
      .single();

    // Update payment status
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'succeeded',
        processed_at: new Date().toISOString(),
        gateway_response: paymentIntent,
      })
      .eq('payment_intent_id', paymentIntent.id);

    // Send order confirmation email
    if (order) {
      await EmailService.sendOrderConfirmation(
        order.users.email,
        order,
        `${order.users.first_name} ${order.users.last_name}`
      );
    }

    console.log(`Payment succeeded for order ${paymentIntent.metadata.order_id}`);
  } catch (error) {
    console.error('Handle Payment Succeeded Error:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    // Update payment status
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'failed',
        failure_reason: paymentIntent.last_payment_error?.message,
        gateway_response: paymentIntent,
      })
      .eq('payment_intent_id', paymentIntent.id);

    console.log(`Payment failed for intent ${paymentIntent.id}`);
  } catch (error) {
    console.error('Handle Payment Failed Error:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    // Update payment status
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'cancelled',
        gateway_response: paymentIntent,
      })
      .eq('payment_intent_id', paymentIntent.id);

    // Update order status
    if (paymentIntent.metadata.order_id) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', paymentIntent.metadata.order_id);
    }

    console.log(`Payment canceled for intent ${paymentIntent.id}`);
  } catch (error) {
    console.error('Handle Payment Canceled Error:', error);
  }
}

async function handleDisputeCreated(dispute: any) {
  try {
    // Get payment and order details
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('order_id, gateway_response')
      .eq('payment_intent_id', dispute.payment_intent)
      .single();

    if (payment) {
      // Update order status to indicate dispute
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'cancelled',
          internal_notes: `Payment dispute created: ${dispute.reason}`,
        })
        .eq('id', payment.order_id);

      // Send notification to admin
      await EmailService.sendContactNotification({
        name: 'System Notification',
        email: 'admin@biopara.com',
        subject: 'Payment Dispute Created',
        message: `A payment dispute has been created for order ${payment.order_id}. Reason: ${dispute.reason}`,
      });
    }

    console.log(`Dispute created for payment ${dispute.payment_intent}`);
  } catch (error) {
    console.error('Handle Dispute Created Error:', error);
  }
}
