"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Trash2, Truck, Shield, RefreshCw } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import Button from "../ui/Button";

interface CartItem {
  id: number | string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  capacity?: string;
  inStock?: boolean;
}

interface OrderSummaryProps {
  items?: CartItem[];
  shippingCost?: number;
  taxRate?: number;
  showActions?: boolean;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items: propItems,
  shippingCost = 30,
  taxRate = 0.2,
  showActions = true,
  className = "",
}) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const items = propItems || cart;

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} درهم`;
  };

  const handleQuantityChange = (id: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center ${className}`}>
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">السلة فارغة</h3>
        <p className="text-gray-600 mb-4">لا توجد منتجات في سلة التسوق الخاصة بك</p>
        <Button
          onClick={() => window.location.href = "/products"}
          variant="primary"
        >
          تصفح المنتجات
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          ملخص الطلب ({items.length} منتجات)
        </h2>
      </div>

      {/* Items List */}
      <div className="max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </h3>
                
                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-center gap-2">
                {showActions && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
                      disabled={item.quantity <= 1}
                      aria-label="إنقاص الكمية"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
                      aria-label="زيادة الكمية"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {showActions && (
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="إزالة المنتج"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">المجموع الفرعي</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">شحن</span>
            <span className="font-medium">{formatPrice(shippingCost)}</span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">الضريبة (20%)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>

          {/* Total */}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">المجموع الكلي</span>
              <span className="text-lg font-bold text-emerald-600">{formatPrice(subtotal + shippingCost + tax)}</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4" />
            <span>شحن مجاني للطلبات فوق 300 DH</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>ضمان استرجاع 7 أيام</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RefreshCw className="w-4 h-4" />
            <span>استبدال مجاني خلال 30 يوم</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
