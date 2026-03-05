// =================================
// TEST ADAPTERS FOR SERVICES
// =================================

// Import existing services
import { OrdersService as ExistingOrdersService } from './orders';
import { ReviewsService as ExistingReviewsService } from './reviews';
import { EmailService as ExistingEmailService } from './email';
import { ShippingService as ExistingShippingService } from './shipping';
import { validateSchema as existingValidateSchema } from '@/lib/utils/validation';

// Import test types
import { OrderData, OrderResult } from '@/types/orders';
import { ReviewData, ReviewResult } from '@/types/reviews';
import { EmailResult } from '@/types/email';
import { ShipmentRequest, ShippingRatesResult, TrackingResult } from '@/types/shipping';
import { ValidationResult } from '@/types/validation';

// =================================
// ORDERS SERVICE ADAPTER
// =================================

export class OrdersService {
  static async createOrder(orderData: OrderData): Promise<OrderResult> {
    try {
      // Convert test interface to existing service interface
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      const taxAmount = subtotal * 0.1; // 10% tax
      const shippingAmount = orderData.shipping_amount || 9.99;
      const totalAmount = subtotal + taxAmount + shippingAmount;

      const existingOrderData = {
        user_id: orderData.user_id,
        items: orderData.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          unit_price: item.price,
          total_price: item.price * (item.quantity || 1)
        })),
        shipping_address_id: 'test-address-id', // Mock address ID
        currency: 'MAD',
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount
      };

      const result = await ExistingOrdersService.createOrder(existingOrderData);
      
      return {
        success: result.success,
        order: result.order ? {
          ...result.order,
          tracking_number: result.order.tracking_number
        } : undefined,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      };
    }
  }

  static async getOrder(orderId: string): Promise<OrderResult> {
    const result = await ExistingOrdersService.getOrderById(orderId);
    return {
      success: result.success,
      order: result.order ? {
        ...result.order,
        tracking_number: result.order.tracking_number
      } : undefined,
      error: result.error
    };
  }

  static async updateOrderStatus(orderId: string, status: string, trackingNumber?: string): Promise<OrderResult> {
    const result = await ExistingOrdersService.updateOrderStatus(orderId, status, trackingNumber);
    return {
      success: result.success,
      order: result.order ? {
        ...result.order,
        tracking_number: result.order.tracking_number || trackingNumber
      } : undefined,
      error: result.error
    };
  }
}

// =================================
// REVIEWS SERVICE ADAPTER
// =================================

export class ReviewsService {
  static async createReview(reviewData: ReviewData): Promise<ReviewResult> {
    const result = await ExistingReviewsService.createReview(reviewData);
    return {
      success: result.success,
      review: result.review,
      error: result.error
    };
  }

  static async getProductReviews(productId: string, page: number = 1, limit: number = 10): Promise<any> {
    // TODO: Implement product reviews retrieval
    console.log('Getting product reviews:', productId, page, limit);
    return {
      success: false,
      error: 'Service not implemented yet'
    };
  }
}

// =================================
// EMAIL SERVICE ADAPTER
// =================================

export class EmailService {
  static async sendOrderConfirmation(email: string, orderData: any, customerName: string): Promise<EmailResult> {
    // TODO: Implement email sending
    console.log('Sending order confirmation:', email, orderData, customerName);
    return {
      success: false,
      error: 'Service not implemented yet'
    };
  }

  static async sendPasswordReset(email: string, resetToken: string, userName: string): Promise<EmailResult> {
    // TODO: Implement password reset email
    console.log('Sending password reset:', email, resetToken, userName);
    return {
      success: false,
      error: 'Service not implemented yet'
    };
  }
}

// =================================
// SHIPPING SERVICE ADAPTER
// =================================

export class ShippingService {
  private static instance: ShippingService;

  static getInstance(): ShippingService {
    if (!ShippingService.instance) {
      ShippingService.instance = new ShippingService();
    }
    return ShippingService.instance;
  }

  async getShippingRates(request: ShipmentRequest): Promise<ShippingRatesResult> {
    // TODO: Implement shipping rates
    console.log('Getting shipping rates:', request);
    return {
      success: false,
      error: 'Service not implemented yet'
    };
  }

  async trackShipment(trackingNumber: string, carrier: string): Promise<TrackingResult> {
    // TODO: Implement shipment tracking
    console.log('Tracking shipment:', trackingNumber, carrier);
    return {
      success: false,
      error: 'Service not implemented yet'
    };
  }

  // Additional methods expected by tests
  async calculateDomesticRates(): Promise<ShippingRatesResult> {
    return {
      success: false,
      error: 'Service not implemented yet'
    };
  }

  async createShipment(request: ShipmentRequest): Promise<{ success: boolean; tracking_number?: string; error?: string }> {
    return {
      success: false,
      error: 'Service not implemented yet'
    };
  }
}

// =================================
// VALIDATION ADAPTER
// =================================

export function validateSchema(schema: any, data: any): ValidationResult {
  try {
    const result = existingValidateSchema(schema, data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      errors: error instanceof Error ? [error.message] : ['Validation failed']
    };
  }
}
