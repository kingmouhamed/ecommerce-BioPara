"use client";

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Truck, Shield, RefreshCw } from 'lucide-react';

export default function OrderSummary() {
  const { cart, calculateTotal: getCartTotal, cartItemCount } = useCart();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Free shipping for orders over 200 SAR
    return subtotal >= 200 ? 0 : 20;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const tax = calculateTax();
  const total = calculateTotal();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">ملخص الطلب</h2>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 space-x-reverse">
            <Image
              src={item.image}
              alt={item.title}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">
                {(item.price * item.quantity).toFixed(2)} ر.س
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ر.س</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>الشحن</span>
          <span>
            {shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} ر.س`}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>ضريبة القيمة المضافة (15%)</span>
          <span>{tax.toFixed(2)} ر.س</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>المجموع</span>
            <span>{total.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      {subtotal < 200 && (
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
          <div className="flex items-center space-x-2 space-x-reverse text-emerald-700">
            <Truck className="w-4 h-4" />
            <span className="text-sm">
              أضف {(200 - subtotal).toFixed(2)} ر.س أخرى للحصول على شحن مجاني!
            </span>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>ضمان استرجاع خلال 30 يوم</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>توصيل سريع خلال 24-48 ساعة</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span>منتجات أصلية 100%</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          كود الخصم (اختياري)
        </label>
        <div className="flex space-x-2 space-x-reverse">
          <input
            type="text"
            placeholder="أدخل كود الخصم"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            تطبيق
          </button>
        </div>
      </div>
    </div>
  );
}
