"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";

export default function FavoritesPage() {
  const { user } = useUser();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "La Roche-Posay Crème Hydratante Visage - 50ml",
      price: 280,
      image: "/images/parapharmacie/face-cream.jpg",
      brand: "La Roche-Posay"
    },
    {
      id: 2,
      title: "Vichy Mineral 89 - 75ml",
      price: 320,
      image: "/images/parapharmacie/serum.jpg",
      brand: "Vichy"
    }
  ]);

  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">المفضلات</h1>
            <p className="text-gray-600 mb-8">يجب تسجيل الدخول لعرض المفضلات</p>
            <Link 
              href="/auth/login" 
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">المفضلات</h1>
          <p className="text-gray-600">{favorites.length} منتجات</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات في المفضلات</h2>
            <p className="text-gray-600 mb-8">أضف منتجاتك المفضلة لعرضها هنا</p>
            <Link 
              href="/products" 
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    width={192}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">{item.price} درهم</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
