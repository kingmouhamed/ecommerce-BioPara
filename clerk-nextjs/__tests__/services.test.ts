// =================================
// BASIC TESTS
// =================================

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { OrdersService } from '@/lib/services/test-adapters';
import { ReviewsService } from '@/lib/services/test-adapters';
import { EmailService } from '@/lib/services/test-adapters';
import { ShippingService } from '@/lib/services/test-adapters';
import { validateSchema } from '@/lib/services/test-adapters';

// Mock data
const mockProduct = {
  id: 'test-product-id',
  name: 'Test Product',
  slug: 'test-product',
  price: 29.99,
  stock_quantity: 10,
};

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
};

const mockOrder = {
  id: 'test-order-id',
  order_number: 'ORD-123456',
  user_id: 'test-user-id',
  status: 'pending',
  total_amount: 100.00,
};

// =================================
// ORDERS SERVICE TESTS
// =================================

describe('OrdersService', () => {
  beforeEach(() => {
    // Setup mocks before each test
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const orderData = {
        user_id: 'test-user-id',
        items: [
          {
            product_id: 'test-product-id',
            quantity: 2,
            unit_price: 29.99,
            total_price: 59.98,
          },
        ],
        shipping_address_id: 'test-address-id',
      };

      const result = await OrdersService.createOrder(orderData as any);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order!.order_number).toMatch(/^ORD-\d+$/);
    });

    it('should handle invalid order data', async () => {
      const invalidOrderData = {
        user_id: 'test-user-id',
        items: [], // Invalid: empty items
        shipping_address_id: 'test-address-id',
      };

      const result = await OrdersService.createOrder(invalidOrderData as any);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Order must contain at least one item');
    });
  });

  describe('getOrderById', () => {
    it('should retrieve order by ID', async () => {
      const result = await OrdersService.getOrder('test-order-id');

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order!.id).toBe('test-order-id');
    });

    it('should handle non-existent order', async () => {
      const result = await OrdersService.getOrder('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status to shipped', async () => {
      const result = await OrdersService.updateOrderStatus(
        'test-order-id',
        'shipped',
        '1Z9999W99999999999');

      expect(result.success).toBe(true);
      expect(result.order!.status).toBe('shipped');
      expect(result.order!.tracking_number).toBe('1Z9999W99999999999');
    });
  });
});

// =================================
// REVIEWS SERVICE TESTS
// =================================

describe('ReviewsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      const reviewData = {
        product_id: 'test-product-id',
        user_id: 'test-user-id',
        rating: 5,
        title: 'Great Product',
        content: 'This is an amazing product!',
      };

      const result = await ReviewsService.createReview(reviewData);

      expect(result.success).toBe(true);
      expect(result.review).toBeDefined();
      expect(result.review!.rating).toBe(5);
    });

    it('should handle invalid rating', async () => {
      const invalidReviewData = {
        product_id: 'test-product-id',
        user_id: 'test-user-id',
        rating: 6, // Invalid: rating must be 1-5
        title: 'Great Product',
        content: 'This is an amazing product!',
      };

      const result = await ReviewsService.createReview(invalidReviewData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rating must be at most 5');
    });

    it('should prevent duplicate reviews', async () => {
      const reviewData = {
        product_id: 'test-product-id',
        user_id: 'test-user-id',
        rating: 4,
        title: 'Good Product',
        content: 'This is a good product!',
      };

      // First review should succeed
      const firstResult = await ReviewsService.createReview(reviewData);
      expect(firstResult.success).toBe(true);

      // Second review should fail
      const secondResult = await ReviewsService.createReview(reviewData);
      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already reviewed');
    });
  });

  describe('getProductReviews', () => {
    it('should retrieve product reviews', async () => {
      const result = await ReviewsService.getProductReviews('test-product-id');

      expect(result.success).toBe(true);
      expect(result.reviews).toBeDefined();
      expect(Array.isArray(result.reviews)).toBe(true);
    });

    it('should paginate reviews correctly', async () => {
      const result1 = await ReviewsService.getProductReviews('test-product-id', 1, 5);
      const result2 = await ReviewsService.getProductReviews('test-product-id', 2, 5);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.pagination.currentPage).toBe(1);
      expect(result2.pagination.currentPage).toBe(2);
    });
  });
});

// =================================
// EMAIL SERVICE TESTS
// =================================

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOrderConfirmation', () => {
    it('should send order confirmation email', async () => {
      const orderData = {
        ...mockOrder,
        user: mockUser,
        items: [mockProduct],
      };

      const result = await EmailService.sendOrderConfirmation(
        'test@example.com',
        orderData,
        'Test User'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should handle invalid email address', async () => {
      const result = await EmailService.sendOrderConfirmation(
        'invalid-email',
        mockOrder,
        'Test User'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email');
    });
  });

  describe('sendPasswordReset', () => {
    it('should send password reset email', async () => {
      const result = await EmailService.sendPasswordReset(
        'test@example.com',
        'reset-token-123',
        'Test User'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });
});

// =================================
// SHIPPING SERVICE TESTS
// =================================

describe('ShippingService', () => {
  let shippingService: ShippingService;

  beforeEach(() => {
    jest.clearAllMocks();
    shippingService = ShippingService.getInstance();
  });

  describe('getShippingRates', () => {
    it('should return shipping rates', async () => {
      const request = {
        from_address: {
          name: 'Sender',
          street1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'US',
        },
        to_address: {
          name: 'Recipient',
          street1: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90001',
          country: 'US',
        },
        parcels: [{
          length: 10,
          width: 8,
          height: 5,
          weight: 2,
          distance_unit: 'in',
          mass_unit: 'lb',
        }],
      };

      const result = await shippingService.getShippingRates(request);

      expect(result.success).toBe(true);
      expect(result.rates).toBeDefined();
      expect(Array.isArray(result.rates)).toBe(true);
    });

    it('should sort rates by price', async () => {
      const request = {
        from_address: {
          name: 'Sender',
          street1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'US',
        },
        to_address: {
          name: 'Recipient',
          street1: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90001',
          country: 'US',
        },
        parcels: [{
          length: 10,
          width: 8,
          height: 5,
          weight: 2,
          distance_unit: 'in',
          mass_unit: 'lb',
        }],
      };

      const result = await shippingService.getShippingRates(request);

      expect(result.success).toBe(true);
      expect(result.rates![0].rate).toBeLessThanOrEqual(result.rates![1]?.rate || Infinity);
    });
  });

  describe('calculateDomesticRates', () => {
    it('should calculate domestic shipping rates', async () => {
      const rates = await shippingService.calculateDomesticRates();

      expect(rates).toBeDefined();
      expect(rates.rates!.length).toBeGreaterThan(0);
      expect(rates.rates![0].rate).toBeGreaterThan(0);
      expect(rates.rates![0].rate).toBeGreaterThan(0);
    });
  });

  describe('trackShipment', () => {
    it('should track shipment successfully', async () => {
      const result = await shippingService.trackShipment('1Z9999W99999999999', 'FedEx');

      expect(result.success).toBe(true);
      expect(result.status).toBeDefined();
      expect(result.tracking_number).toBe('1Z9999W99999999999');
    });

    it('should handle invalid tracking number', async () => {
      const result = await shippingService.trackShipment('invalid-tracking', 'Unknown Carrier');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

// =================================
// VALIDATION TESTS
// =================================

describe('Validation', () => {
  describe('validateSchema', () => {
    it('should validate valid data', () => {
      const validData = {
        name: 'Test Product',
        price: 29.99,
        category_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = validateSchema({
        name: 'string',
        price: 'number',
        category_id: 'string',
      }, validData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject invalid data', () => {
      const invalidData = {
        name: '', // Invalid: empty name
        price: -10, // Invalid: negative price
        category_id: 'invalid-uuid', // Invalid: not a UUID
      };

      const result = validateSchema({
        name: 'string',
        price: 'number',
        category_id: 'string',
      }, invalidData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});

// =================================
// INTEGRATION TESTS
// =================================

describe('Integration Tests', () => {
  it('should complete full order flow', async () => {
    // 1. Create order
    const orderData = {
      user_id: 'test-user-id',
      items: [{
        product_id: 'test-product-id',
        quantity: 1,
        unit_price: 29.99,
        total_price: 29.99,
      }],
      shipping_address_id: 'test-address-id',
    };

    const orderResult = await OrdersService.createOrder(orderData as any);
    expect(orderResult.success).toBe(true);

    // 2. Get shipping rates
    const shippingRequest = {
      from_address: { /* mock sender address */ },
      to_address: { /* mock recipient address */ },
      parcels: [{ /* mock parcel data */ }],
    };

    const shippingResult = await ShippingService.getInstance().getShippingRates(shippingRequest as any);
    expect(shippingResult.success).toBe(true);

    // 3. Create shipment
    const shipmentResult = await ShippingService.getInstance().createShipment(
      shippingRequest as any
    );
    expect(shipmentResult.success).toBe(true);

    // 4. Send confirmation email
    const emailResult = await EmailService.sendOrderConfirmation(
      'test@example.com',
      orderResult.order,
      'Test User'
    );
    expect(emailResult.success).toBe(true);

    // 5. Update order status
    const updateResult = await OrdersService.updateOrderStatus(
      orderResult.order!.id,
      'confirmed'
    );
    expect(updateResult.success).toBe(true);
  });
});

