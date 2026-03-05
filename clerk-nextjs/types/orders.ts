// =================================
// ORDER TYPES
// =================================

export interface OrderItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  quantity?: number;
}

export interface ShippingAddress {
  name: string;
  street1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderData {
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  created_at?: string;
  status?: string;
  order_number?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  tracking_number?: string;
}

export interface OrderResult {
  success: boolean;
  order?: Order;
  error?: string;
}

export interface OrderListResult {
  success: boolean;
  orders?: Order[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  error?: string;
}
