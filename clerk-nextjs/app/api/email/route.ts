// =================================
// EMAIL API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { EmailService, OrderData, CartItem } from '@/lib/services/email';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';

// Get supabase client
const supabaseAdmin = getSupabaseAdmin();

interface OrderSummary {
  id: string;
  order_number: string;
  created_at: string | Date;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  shipping_address: string;
  tracking_url?: string;
  tracking_number?: string;
  users: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { type, ...data } = body;

    let result;

    switch (type) {
      case 'order_confirmation':
        result = await sendOrderConfirmation(data);
        break;

      case 'shipping_confirmation':
        result = await sendShippingConfirmation(data);
        break;

      case 'password_reset':
        result = await sendPasswordReset(data);
        break;

      case 'welcome':
        result = await sendWelcomeEmail(data);
        break;

      case 'newsletter_confirmation':
        result = await sendNewsletterConfirmation(data);
        break;

      case 'refund_confirmation':
        result = await sendRefundConfirmation(data);
        break;

      case 'review_request':
        result = await sendReviewRequest(data);
        break;

      case 'abandoned_cart':
        result = await sendAbandonedCartReminder(data);
        break;

      case 'contact_notification':
        result = await sendContactNotification(data);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type' },
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
      messageId: result.messageId,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendOrderConfirmation(data: { orderId: string }) {
  const { orderId } = data;

  // Get order details
  const { data: order } = await supabaseAdmin
    .from('order_summary')
    .select(`
      *,
      users!inner (
        email,
        first_name,
        last_name
      )
    `)
    .eq('id', orderId)
    .single();

  if (!order) {
    return { success: false, error: 'Order not found' };
  }

  // Get order items
  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  const orderData: OrderData = {
    order_number: order.order_number,
    created_at: order.created_at,
    items: items as OrderItem[],
    subtotal: order.subtotal,
    tax_amount: order.tax_amount,
    shipping_amount: order.shipping_amount,
    total_amount: order.total_amount,
    shipping_address: order.shipping_address,
    tracking_url: order.tracking_url,
    id: order.id,
    tracking_number: order.tracking_number,
  };

  return await EmailService.sendOrderConfirmation(
    order.users.email,
    orderData,
    `${order.users.first_name} ${order.users.last_name}`
  );
}

async function sendShippingConfirmation(data: { orderId: string }) {
  const { orderId } = data;

  // Get order details
  const { data: order } = await supabaseAdmin
    .from('order_summary')
    .select(`
      *,
      users!inner (
        email,
        first_name,
        last_name
      )
    `)
    .eq('id', orderId)
    .single();

  if (!order) {
    return { success: false, error: 'Order not found' };
  }

  const orderData: OrderData = {
    order_number: order.order_number,
    created_at: order.created_at,
    subtotal: order.subtotal,
    tax_amount: order.tax_amount,
    shipping_amount: order.shipping_amount,
    total_amount: order.total_amount,
    shipping_address: order.shipping_address,
    tracking_url: order.tracking_url,
    id: order.id,
    tracking_number: order.tracking_number,
  };

  return await EmailService.sendShippingConfirmation(
    order.users.email,
    orderData,
    `${order.users.first_name} ${order.users.last_name}`
  );
}

async function sendPasswordReset(data: { email: string; resetToken: string; customerName: string }) {
  const { email, resetToken, customerName } = data;

  return await EmailService.sendPasswordReset(email, resetToken, customerName);
}

async function sendWelcomeEmail(data: { email: string; customerName: string; verificationUrl?: string }) {
  const { email, customerName, verificationUrl } = data;

  return await EmailService.sendWelcomeEmail(email, customerName, verificationUrl);
}

async function sendNewsletterConfirmation(data: { email: string; customerName: string }) {
  const { email, customerName } = data;

  return await EmailService.sendNewsletterConfirmation(email, customerName);
}

async function sendRefundConfirmation(data: { orderId: string; refundAmount: number }) {
  const { orderId, refundAmount } = data;

  // Get order details
  const { data: order } = await supabaseAdmin
    .from('order_summary')
    .select(`
      *,
      users!inner (
        email,
        first_name,
        last_name
      )
    `)
    .eq('id', orderId)
    .single();

  if (!order) {
    return { success: false, error: 'Order not found' };
  }

  const orderData: OrderData = {
    order_number: order.order_number,
    created_at: order.created_at,
    subtotal: order.subtotal,
    tax_amount: order.tax_amount,
    shipping_amount: order.shipping_amount,
    total_amount: order.total_amount,
    shipping_address: order.shipping_address,
    tracking_url: order.tracking_url,
    id: order.id,
    tracking_number: order.tracking_number,
  };

  return await EmailService.sendRefundConfirmation(
    order.users.email,
    orderData,
    refundAmount,
    `${order.users.first_name} ${order.users.last_name}`
  );
}

async function sendReviewRequest(data: { orderId: string }) {
  const { orderId } = data;

  // Get order details
  const { data: order } = await supabaseAdmin
    .from('order_summary')
    .select(`
      *,
      users!inner (
        email,
        first_name,
        last_name
      )
    `)
    .eq('id', orderId)
    .single();

  if (!order) {
    return { success: false, error: 'Order not found' };
  }

  const orderData: OrderData = {
    order_number: order.order_number,
    created_at: order.created_at,
    subtotal: order.subtotal,
    tax_amount: order.tax_amount,
    shipping_amount: order.shipping_amount,
    total_amount: order.total_amount,
    shipping_address: order.shipping_address,
    tracking_url: order.tracking_url,
    id: order.id,
    tracking_number: order.tracking_number,
  };

  return await EmailService.sendReviewRequest(
    order.users.email,
    orderData,
    `${order.users.first_name} ${order.users.last_name}`
  );
}

async function sendAbandonedCartReminder(data: { email: string; customerName: string; cartItems: CartItem[]; cartTotal: number }) {
  const { email, customerName, cartItems, cartTotal } = data;

  return await EmailService.sendAbandonedCartReminder(
    email,
    cartItems,
    customerName,
    cartTotal
  );
}

async function sendContactNotification(data: { name: string; email: string; subject: string; message: string }) {
  const { name, email, subject, message } = data;

  return await EmailService.sendContactNotification({
    name,
    email,
    subject,
    message,
  });
}
