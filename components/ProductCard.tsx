"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image_url,
    });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 h-48">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {product.is_featured && (
            <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              مميز
            </div>
          )}

          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-all"
            aria-label="إضافة إلى المفضلة"
          >
            <Heart size={20} className="text-gray-400" />
          </button>

          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">غير متوفر</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.review_count})
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-600">
                {product.price.toFixed(2)} درهم
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isAdding}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              أضف للسلة
            </button>
          </div>
        </div>

        {showNotification && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg text-primary-600 font-bold">
              تمت الإضافة!
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
