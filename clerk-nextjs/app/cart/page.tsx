"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load cart from localStorage
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  const removeFromCart = (productId: number | string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      // Update localStorage
      try {
        if (newCart.length > 0) {
          localStorage.setItem('cart', JSON.stringify(newCart));
        } else {
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error("Failed to update cart in localStorage", error);
      }
      return newCart;
    });
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (quantity > 99) {
      console.warn('Quantity exceeds maximum limit:', quantity);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">سلة التسوق فارغة</h1>
            <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products?category=parapharmacie"
                className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
              >
                تسوق البارافارماسي
              </Link>
              <Link
                href="/products?category=medical-herbs"
                className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
              >
                تسوق الأعشاب الطبية
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">سلة التسوق ({cartItemCount} منتجات)</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {cart.map((item) => (
                <div key={item.id} className="p-6 border-b last:border-b-0">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-emerald-700 font-bold text-lg mb-3">{item.price.toFixed(2)} درهم</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition"
                            aria-label="تقليل الكمية"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition"
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 transition p-2"
                          aria-label="حذف المنتج"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-left">
                      <p className="text-sm text-gray-500">المجموع الفرعي</p>
                      <p className="font-bold text-gray-800">{(item.price * item.quantity).toFixed(2)} درهم</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products?category=parapharmacie"
                  className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-2"
                >
                  ← استمر في تسوق البارافارماسي
                </Link>
                <Link
                  href="/products?category=medical-herbs"
                  className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-2"
                >
                  ← استمر في تسوق الأعشاب الطبية
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">ملخص الطلب</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{calculateTotal()} درهم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الشحن</span>
                  <span className="font-medium text-emerald-600">مجاني</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الخصم</span>
                  <span className="font-medium text-red-600">0.00 درهم</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع</span>
                    <span className="text-emerald-700">{calculateTotal()} درهم</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition text-center block"
                >
                  إتمام الطلب
                </Link>

                <Link
                  href="/products?category=parapharmacie"
                  className="w-full border border-emerald-700 text-emerald-700 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition text-center block"
                >
                  العودة للتسوق (البارافارماسي)
                </Link>
                <Link
                  href="/products?category=medical-herbs"
                  className="w-full border border-emerald-700 text-emerald-700 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition text-center block"
                >
                  العودة للتسوق (الأعشاب الطبية)
                </Link>
              </div>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">كود الخصم</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="أدخل الكود"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                  />
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                    تطبيق
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">طرق الدفع الآمنة</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}