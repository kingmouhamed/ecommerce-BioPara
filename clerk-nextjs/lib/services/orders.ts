// =================================
// ORDERS SERVICE
// =================================

import { getSupabaseAdmin } from '@/lib/supabase-server';
import { StripeService } from '@/lib/payments/stripe';
import { generateOrderNumber } from '@/lib/utils/orders';

// Get supabase client
const supabaseAdmin = getSupabaseAdmin();

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CreateOrderRequest {
  user_id?: string;
  items: OrderItem[];
  shipping_address_id: string;
  billing_address_id?: string;
  currency?: string;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: any;
  error?: string;
  payment_intent?: any;
}

export class OrdersService {
  /**
   * Create a new order
   */
  static async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    const supabase = supabaseAdmin;

    try {
      // Start a transaction
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: generateOrderNumber(),
          user_id: data.user_id,
          status: 'pending',
          currency: data.currency || 'USD',
          shipping_address_id: data.shipping_address_id,
          billing_address_id: data.billing_address_id || data.shipping_address_id,
          notes: data.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = data.items.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + item.total_price, 0);
      const taxAmount = subtotal * 0.1; // 10% tax
      const shippingAmount = 9.99; // Fixed shipping
      const totalAmount = subtotal + taxAmount + shippingAmount;

      // Update order with totals
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingAmount,
          total_amount: totalAmount,
        })
        .eq('id', orderData.id);

      if (updateError) throw updateError;

      // Create payment intent
      const paymentResponse = await StripeService.createPaymentIntent({
        amount: totalAmount,
        currency: data.currency || 'USD',
        metadata: {
          order_id: orderData.id,
          order_number: orderData.order_number,
        },
      });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error);
      }

      // Save payment record
      await supabase
        .from('payments')
        .insert({
          order_id: orderData.id,
          payment_method: 'stripe',
          payment_intent_id: paymentResponse.paymentIntent!.id,
          amount: totalAmount,
          currency: data.currency || 'USD',
          status: 'pending',
          gateway_response: paymentResponse.paymentIntent,
        });

      return {
        success: true,
        order: orderData,
        payment_intent: paymentResponse.paymentIntent,
      };
    } catch (error) {
      console.error('Create Order Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string, userId?: string): Promise<OrderResponse> {
    const supabase = supabaseAdmin;

    try {
      let query = supabase
        .from('order_summary')
        .select('*')
        .eq('id', orderId);

      if (userId) {
        const { data: user } = await supabase
          .from('users')
          .select('clerk_id')
          .eq('id', userId)
          .single();

        if (user) {
          query = query.eq('user_id', userId);
        }
      }

      const { data: order, error } = await query.single();

      if (error) throw error;

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Get Order Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve order',
      };
    }
  }

  /**
   * Get user orders
   */
  static async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ success: boolean; orders?: any[]; error?: string; pagination?: any }> {
    const supabase = supabaseAdmin;

    try {
      const offset = (page - 1) * limit;

      const { data: orders, error, count } = await supabase
        .from('order_summary')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalCount: count || 0,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      };

      return {
        success: true,
        orders,
        pagination,
      };
    } catch (error) {
      console.error('Get User Orders Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve orders',
      };
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string,
    trackingUrl?: string
  ): Promise<OrderResponse> {
    const supabase = supabaseAdmin;

    try {
      const updateData: any = { status };

      if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
        if (trackingNumber) updateData.tracking_number = trackingNumber;
        if (trackingUrl) updateData.tracking_url = trackingUrl;
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { data: order, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Update Order Status Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order status',
      };
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string, reason?: string): Promise<OrderResponse> {
    const supabase = supabaseAdmin;

    try {
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Check if order can be cancelled
      if (order.status === 'shipped' || order.status === 'delivered') {
        throw new Error('Order cannot be cancelled at this stage');
      }

      // Update order status
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          notes: reason ? `${order.notes || ''}\n\nCancellation reason: ${reason}` : order.notes,
        })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refund payment if payment was made
      if (order.payment_status === 'succeeded') {
        const { data: payment } = await supabase
          .from('payments')
          .select('payment_intent_id')
          .eq('order_id', orderId)
          .single();

        if (payment?.payment_intent_id) {
          const refundResponse = await StripeService.createRefund(
            payment.payment_intent_id,
            order.total_amount
          );

          if (refundResponse.success) {
            await supabase
              .from('payments')
              .update({
                status: 'refunded',
                refunded_at: new Date().toISOString(),
                refund_amount: order.total_amount,
              })
              .eq('order_id', orderId);
          }
        }
      }

      return {
        success: true,
        order: updatedOrder,
      };
    } catch (error) {
      console.error('Cancel Order Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel order',
      };
    }
  }

  /**
   * Get order items
   */
  static async getOrderItems(orderId: string): Promise<{ success: boolean; items?: any[]; error?: string }> {
    const supabase = supabaseAdmin;

    try {
      const { data: items, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            id,
            name,
            slug,
            images
          )
        `)
        .eq('order_id', orderId);

      if (error) throw error;

      return {
        success: true,
        items,
      };
    } catch (error) {
      console.error('Get Order Items Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve order items',
      };
    }
  }

  /**
   * Get all orders (admin)
   */
  static async getAllOrders(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<{ success: boolean; orders?: any[]; error?: string; pagination?: any }> {
    const supabase = supabaseAdmin;

    try {
      const offset = (page - 1) * limit;

      let query = supabase
        .from('order_summary')
        .select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: orders, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalCount: count || 0,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      };

      return {
        success: true,
        orders,
        pagination,
      };
    } catch (error) {
      console.error('Get All Orders Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve orders',
      };
    }
  }

  /**
   * Update an order by ID
   */
  static async updateOrder(orderId: string, userId: string, updates: any): Promise<OrderResponse> {
    const supabase = supabaseAdmin;

    try {
      // Check if the order exists and belongs to the user
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !order) {
        throw new Error('Order not found or unauthorized');
      }

      // Update the order
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .single();

      if (updateError) {
        throw updateError;
      }

      return {
        success: true,
        order: updatedOrder,
      };
    } catch (error) {
      console.error('Update Order Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order',
      };
    }
  }
}

export default OrdersService;
