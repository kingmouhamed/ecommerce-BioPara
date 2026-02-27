"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Package, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext-fixed';
import Link from 'next/link';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartItemCount, calculateSubtotal, calculateShipping, calculateTotalWithShipping } = useCart();

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const message = `مرحباً، أرغب في طلب المنتجات التالية:\n\n${cart.map((item, index) => 
      `${index + 1}. ${item.title}\n   الكمية: ${item.quantity}\n   السعر: ${item.price} درهم\n   المجموع: ${(item.price * item.quantity).toFixed(2)} درهم`
    ).join('\n')}\n\nالمجموع الإجمالي: ${formatPrice(calculateSubtotal())} درهم\n${calculateShipping() > 0 ? `رسوم الشحن: ${formatPrice(calculateShipping())} درهم\n` : ''}المجموع النهائي: ${formatPrice(calculateTotalWithShipping())} درهم\n\nأرجو تأكيد الطلب وتفاصيل الشحن والدفع.\n\nشكراً!`;
    
    const whatsappUrl = `https://wa.me/212673020264?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              السلة ({cartItemCount})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-4">السلة فارغة</p>
                <Link
                  href="/products"
                  className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  onClick={onClose}
                >
                  تصفح المنتجات
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>{item.brand}</span>
                        {item.capacity && <span>• {item.capacity}</span>}
                        {item.inStock !== undefined && (
                          <span className={item.inStock ? 'text-green-600' : 'text-red-600'}>
                            {item.inStock ? 'متوفر' : 'نفد المخزون'}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">الكمية:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity >= 99}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-600">
                          × {formatPrice(item.price)} = {formatPrice(item.price * item.quantity)} درهم
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-medium">{formatPrice(calculateSubtotal())} درهم</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">رسوم الشحن:</span>
                  <span className="font-medium">
                    {calculateShipping() > 0 ? `${formatPrice(calculateShipping())} درهم` : 'مجاني'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع النهائي:</span>
                  <span className="font-bold text-lg text-emerald-600">{formatPrice(calculateTotalWithShipping())} درهم</span>
                </div>
                {calculateSubtotal() >= 299 && (
                  <div className="text-xs text-green-600 text-center mt-2">
                    🎁 الشحن مجاني للطلبات فوق 299 درهم
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  طلب عبر واتساب
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={clearCart}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
                  >
                    تفريغ السلة
                  </button>
                  <Link
                    href="/products"
                    className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm text-center"
                    onClick={onClose}
                  >
                    متابعة التسوق
                  </Link>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="text-xs text-gray-500 text-center mt-4">
                <div className="flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>التوصيل خلال 24-48 ساعة</span>
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  الدفع عند الاستلام متاح في المدن الرئيسية
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
