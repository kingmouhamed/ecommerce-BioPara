"use client";

import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import GlobalCheckoutPage from "../../components/GlobalCheckoutPage";

export default function CheckoutPage() {
  const { cart, cartItemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Add products to your cart to continue
            </p>
            <Link
              href="/products"
              className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <GlobalCheckoutPage />;
}
