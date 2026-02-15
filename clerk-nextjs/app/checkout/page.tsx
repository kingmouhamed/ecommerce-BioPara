"use client";

import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import OrderSummary from "../../components/checkout/OrderSummary";

export default function CheckoutPage() {
  const { cart, cartItemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">سلة التسوق فارغة</h1>
            <p className="text-gray-600 mb-8">
              لا توجد منتجات في سلة التسوق الخاصة بك. قم بإضافة بعض المنتجات أولاً.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products?category=parapharmacie"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl transition-colors"
              >
                تسوق البارافارماسي
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?category=medical-herbs"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-2xl border border-gray-200 transition-colors"
              >
                تسوق الأعشاب الطبية
                <ArrowRight className="w-5 h-5" />
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
          <p className="text-gray-600 mt-2">
            لديك {cartItemCount} منتجات في سلة التسوق
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CheckoutForm 
            onSubmit={async (data) => {
              console.log('Order submitted:', data);
              // Here you would typically send the order to your backend
            }}
          />
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
