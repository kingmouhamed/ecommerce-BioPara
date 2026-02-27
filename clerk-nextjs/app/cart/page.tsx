"use client";

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Package, Truck, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';

interface CartPageProps {}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartItemCount, calculateSubtotal, calculateShipping, calculateTotalWithShipping } = useCart();

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);

    try {
      const message = `مرحباً، أرغب في طلب المنتجات التالية:\n\n${cart.map((item: any, index: number) => 
        `${index + 1}. ${item.title}\n   الكمية: ${item.quantity}\n   السعر: ${item.price} درهم\n   المجموع: ${(item.price * item.quantity).toFixed(2)} درهم`
      ).join('\n')}\n\nالمجموع الإجمالي: ${formatPrice(calculateSubtotal())} درهم\n${calculateShipping() > 0 ? `رسوم الشحن: ${formatPrice(calculateShipping())} درهم\n` : ''}المجموع النهائي: ${formatPrice(calculateTotalWithShipping())} درهم\n\nأرجو تأكيد الطلب وتفاصيل الشحن والدفع.\n\nشكراً!`;
      
      const whatsappUrl = `https://wa.me/212673020264?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Simulate order completion after a delay
      setTimeout(() => {
        setOrderCompleted(true);
        clearCart();
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    // For now, redirect to WhatsApp
    handleWhatsAppOrder();
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">تم إرسال طلبك بنجاح!</h1>
          <p className="text-xl text-gray-600 mb-8">سيتم التواصل معك قريباً لتأكيد التفاصيل</p>
          <Link
            href="/products"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            متابعة التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BioPara</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-emerald-600 font-medium">
                السلة ({cartItemCount})
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-emerald-600 transition-colors">
                العودة للمنتجات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">السلة التسوق</h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">السلة فارغة</h2>
              <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
              <Link
                href="/products"
                className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                تصفح المنتجات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                            {item.title}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="حذف من السلة"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                          <span>{item.brand}</span>
                          {item.capacity && <span>• {item.capacity}</span>}
                          {item.inStock !== undefined && (
                            <span className={item.inStock ? 'text-green-600' : 'text-red-600'}>
                              {item.inStock ? 'متوفر' : 'نفد المخزون'}
                            </span>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price)} درهم
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">الكمية:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                                title="إنقاص الكمية"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium px-2">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.quantity >= 99}
                                title="زيادة الكمية"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-sm text-gray-600">
                              × {formatPrice(item.price * item.quantity)} درهم
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h3>
                  
                  <div className="space-y-4">
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
                  </div>

                  {calculateSubtotal() >= 299 && (
                    <div className="text-xs text-green-600 text-center mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Package className="w-4 h-4" />
                        <span className="font-medium">الشحن مجاني!</span>
                      </div>
                      <p className="text-xs">للطلبات فوق 299 درهم</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-6">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                          <span>جاري معالجة الطلب...</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-5 h-5" />
                          طلب عبر واتساب
                        </>
                      )}
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
                      >
                        متابعة التسوق
                      </Link>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="text-xs text-gray-500 text-center mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Truck className="w-4 h-4" />
                      <span>التوصيل خلال 24-48 ساعة</span>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      الدفع عند الاستلام متاح في المدن الرئيسية
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-2">
                      <span className="font-medium">رقم الواتساب:</span> +212 673020264
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}