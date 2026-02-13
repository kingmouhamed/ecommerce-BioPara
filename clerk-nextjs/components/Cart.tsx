"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, calculateTotal, cartItemCount, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (isProcessing || cart.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Close cart and redirect to checkout
      setIsCartOpen(false);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to checkout page
      window.location.href = '/checkout';
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('حدث خطأ أثناء الانتقال إلى صفحة الدفع.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
      <div className="absolute left-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl" dir="rtl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="text-base sm:text-lg font-semibold">عربة التسوق</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                {cartItemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {cart.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">عربة التسوق فارغة</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                      <p className="text-emerald-600 font-semibold mb-2">{item.price} درهم</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-3 sm:p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm sm:text-base">المجموع:</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-600">{calculateTotal()} درهم</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الانتقال...
                  </div>
                ) : (
                  'إتمام الطلب'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
