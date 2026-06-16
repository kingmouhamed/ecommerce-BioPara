"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartProduct {
  id: string | number;
  name: string;
  name_ar: string;
  price: number;
  images: string[] | null;
  slug: string;
}

interface AddToCartButtonProps {
  product: AddToCartProduct;
  stock: number;
}

export default function AddToCartButton({ product, stock }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (added) return;

    const cartItem = {
      id: product.id,
      title: product.name_ar || product.name,
      price: product.price,
      image:
        product.images && product.images.length > 0
          ? product.images[0]
          : "/images/products/product-placeholder.jpg",
      slug: product.slug,
    };

    addToCart(cartItem, 1);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  if (stock === 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full h-14 rounded-xl bg-red-100 text-red-600 font-bold text-lg cursor-not-allowed border border-red-200"
        aria-disabled="true"
      >
        نفد المخزون
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={added}
      className={`w-full h-14 rounded-xl font-bold text-lg text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E] focus-visible:ring-offset-2 ${
        added
          ? "bg-[#2D4A2E] cursor-default"
          : "bg-[#C8963E] hover:bg-[#E0AC55] active:scale-[0.98]"
      }`}
      aria-live="polite"
    >
      {added ? "✓ تمت الإضافة" : "أضف إلى السلة 🛒"}
    </button>
  );
}
