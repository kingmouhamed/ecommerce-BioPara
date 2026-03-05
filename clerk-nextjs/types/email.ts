// =================================
// EMAIL TYPES
// =================================

export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface OrderConfirmationData extends EmailData {
  order_number: string;
  customer_name: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  shipping_address: {
    name: string;
    street1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface PasswordResetData extends EmailData {
  reset_token: string;
  user_name: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
