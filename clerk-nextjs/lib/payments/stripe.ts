// =================================
// STRIPE PAYMENT SERVICE
// =================================

import Stripe from 'stripe';
import { NextRequest } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
} as any);

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  customer?: string;
  payment_method?: string;
  confirmation_method?: string;
  capture_method?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
  clientSecret?: string;
}

export class StripeService {
  /**
   * Create a payment intent
   */
  static async createPaymentIntent(
    data: PaymentIntentRequest
  ): Promise<PaymentResponse> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'usd',
        metadata: data.metadata || {},
        customer: data.customer,
        payment_method: data.payment_method,
        confirmation_method: data.confirmation_method as Stripe.PaymentIntent.ConfirmationMethod || 'manual',
        capture_method: data.capture_method as Stripe.PaymentIntent.CaptureMethod || 'automatic',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        paymentIntent,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  /**
   * Confirm a payment intent
   */
  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<PaymentResponse> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntent,
      };
    } catch (error) {
      console.error('Stripe Confirm Payment Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  /**
   * Retrieve a payment intent
   */
  static async retrievePaymentIntent(
    paymentIntentId: string
  ): Promise<PaymentResponse> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error('Stripe Retrieve Payment Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment retrieval failed',
      };
    }
  }

  /**
   * Create a refund
   */
  static async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: Stripe.RefundCreateParams.Reason
  ): Promise<{ success: boolean; refund?: Stripe.Refund; error?: string }> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason,
      });

      return {
        success: true,
        refund,
      };
    } catch (error) {
      console.error('Stripe Refund Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed',
      };
    }
  }

  /**
   * Create a customer
   */
  static async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; customer?: Stripe.Customer; error?: string }> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });

      return {
        success: true,
        customer,
      };
    } catch (error) {
      console.error('Stripe Create Customer Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Customer creation failed',
      };
    }
  }

  /**
   * Retrieve a customer
   */
  static async retrieveCustomer(
    customerId: string
  ): Promise<{ success: boolean; customer?: Stripe.Customer; error?: string }> {
    try {
      const customer = await stripe.customers.retrieve(customerId);

      return {
        success: true,
        customer: customer as Stripe.Customer,
      };
    } catch (error) {
      console.error('Stripe Retrieve Customer Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Customer retrieval failed',
      };
    }
  }

  /**
   * Create a payment method
   */
  static async createPaymentMethod(
    paymentMethodType: Stripe.PaymentMethodCreateParams.Type,
    paymentMethodDetails: Stripe.PaymentMethodCreateParams.Card,
    billingDetails?: Stripe.PaymentMethodCreateParams.BillingDetails
  ): Promise<{ success: boolean; paymentMethod?: Stripe.PaymentMethod; error?: string }> {
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: paymentMethodType,
        card: paymentMethodDetails,
        billing_details: billingDetails,
      });

      return {
        success: true,
        paymentMethod,
      };
    } catch (error) {
      console.error('Stripe Create Payment Method Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment method creation failed',
      };
    }
  }

  /**
   * Attach payment method to customer
   */
  static async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string
  ): Promise<{ success: boolean; paymentMethod?: Stripe.PaymentMethod; error?: string }> {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return {
        success: true,
        paymentMethod,
      };
    } catch (error) {
      console.error('Stripe Attach Payment Method Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment method attachment failed',
      };
    }
  }

  /**
   * Create checkout session
   */
  static async createCheckoutSession(
    items: Array<{
      name: string;
      amount: number;
      quantity: number;
      description?: string;
      images?: string[];
    }>,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; session?: Stripe.Checkout.Session; error?: string }> {
    try {
      const line_items = items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
            images: item.images,
          },
          unit_amount: Math.round(item.amount * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
        metadata,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'],
        },
      });

      return {
        success: true,
        session,
      };
    } catch (error) {
      console.error('Stripe Checkout Session Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Checkout session creation failed',
      };
    }
  }

  /**
   * Handle webhook events
   */
  static async handleWebhook(
    request: NextRequest
  ): Promise<{ event: Stripe.Event; error?: string }> {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      throw new Error('No stripe signature');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
      );

      return { event };
    } catch (error) {
      console.error('Stripe Webhook Error:', error);
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  }

  /**
   * Get payment methods for a customer
   */
  static async getCustomerPaymentMethods(
    customerId: string,
    type: Stripe.PaymentMethod.Type = 'card'
  ): Promise<{ success: boolean; paymentMethods?: Stripe.PaymentMethod[]; error?: string }> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: type as any,
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data,
      };
    } catch (error) {
      console.error('Stripe Get Payment Methods Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve payment methods',
      };
    }
  }

  /**
   * Update payment intent metadata
   */
  static async updatePaymentIntentMetadata(
    paymentIntentId: string,
    metadata: Record<string, string>
  ): Promise<{ success: boolean; paymentIntent?: Stripe.PaymentIntent; error?: string }> {
    try {
      const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        metadata,
      });

      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error('Stripe Update Payment Intent Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment intent',
      };
    }
  }
}

export default StripeService;
