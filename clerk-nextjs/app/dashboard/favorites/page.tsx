"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";

export default function FavoritesPage() {
  const { user } = useUser();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "La Roche-Posay Crème Hydratante Visage - 50ml",
      price: 150.99,
      oldPrice: 180.99,
      image: "/products1.png",
      category: "العناية بالبشرة",
      rating: 4.5,
      reviews: 128
    },
    {
      id: 3,
      title: "CeraVe Sérum Anti-âge - 30ml",
      price: 199.99,
      oldPrice: 249.99,
      image: "/products3.png",
      category: "العناية بالبشرة",
      rating: 4.7,
      reviews: 89
    },
    {
      id: 11,
      title: "BioOriental Huile d'Argan Pure - 100ml",
      price: 89.99,
      oldPrice: 119.99,
      image: "/products11.png",
      category: "الزيوت العطرية",
      rating: 4.8,
      reviews: 256
    }
  ]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">المفضلة</h1>
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6">
            المرجو <Link href="/auth/login" className="text-emerald-700 hover:underline">تسجيل الدخول</Link> لحفظ منتجاتك المفضلة.
          </p>
          <Link
            href="/auth/login"
            className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">المفضلة ({favorites.length})</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات مفضلة</h3>
            <p className="text-gray-500 mb-6">
              ابدأ في إضافة المنتجات التي تعجبك إلى قائمتك المفضلة
            </p>
            <Link
              href="/products"
              className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              استكشف المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative">
                  <Link href={`/products/${product.id}`}>
                    <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain rounded-t-lg"
                      />
                    </div>
                  </Link>
                  
                  {/* Remove from Favorites Button */}
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
                    aria-label="إزالة من المفضلة"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    {product.category}
                  </div>
                  
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 hover:text-emerald-700 transition">
                      {product.title}
                    </h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-emerald-700 font-bold">
                      {product.price.toFixed(2)} DH
                    </span>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {product.oldPrice.toFixed(2)} DH
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-emerald-700 text-white py-2 rounded-lg font-medium hover:bg-emerald-800 transition flex items-center justify-center gap-1 text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      أضف للسلة
                    </button>
                    <button
                      onClick={() => removeFromFavorites(product.id)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition"
                      aria-label="إزالة من المفضلة"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
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
