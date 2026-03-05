// =================================
// ORDER UTILITIES
// =================================

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-6)}-${random}`;
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: Array<{ quantity: number; unit_price: number }>) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxRate = 0.1; // 10% tax
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const totalAmount = subtotal + taxAmount + shippingAmount;

  return {
    subtotal,
    taxAmount,
    shippingAmount,
    totalAmount,
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Get order status display text
 */
export function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };

  return statusMap[status] || status;
}

/**
 * Get order status color
 */
export function getOrderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    processing: 'text-purple-600 bg-purple-50',
    shipped: 'text-indigo-600 bg-indigo-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
    refunded: 'text-gray-600 bg-gray-50',
  };

  return colorMap[status] || 'text-gray-600 bg-gray-50';
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: string): boolean {
  return !['shipped', 'delivered'].includes(status);
}

/**
 * Check if order can be returned
 */
export function canReturnOrder(status: string): boolean {
  return status === 'delivered';
}

/**
 * Get estimated delivery date
 */
export function getEstimatedDeliveryDate(orderDate: Date): Date {
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days delivery
  return deliveryDate;
}

/**
 * Validate order data
 */
export function validateOrderData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.items || data.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (!data.shipping_address_id) {
    errors.push('Shipping address is required');
  }

  if (data.items) {
    data.items.forEach((item: any, index: number) => {
      if (!item.product_id) {
        errors.push(`Item ${index + 1}: Product ID is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (!item.unit_price || item.unit_price <= 0) {
        errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
