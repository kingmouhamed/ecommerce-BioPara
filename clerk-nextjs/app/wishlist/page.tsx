"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

interface WishlistItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  inStock?: boolean;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load wishlist from localStorage
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        const parsedWishlist = JSON.parse(storedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        }
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
  }, []);

  const removeFromWishlist = (productId: number | string) => {
    setWishlist(prevWishlist => {
      const newWishlist = prevWishlist.filter(item => item.id !== productId);
      // Update localStorage
      try {
        if (newWishlist.length > 0) {
          localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        } else {
          localStorage.removeItem('wishlist');
        }
      } catch (error) {
        console.error("Failed to update wishlist in localStorage", error);
      }
      return newWishlist;
    });
  };

  const addToCart = (item: WishlistItem) => {
    // Add to cart logic (you can integrate with CartContext)
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find((cartItem: any) => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        existingCart.push({
          id: item.id,
          title: item.name,
          price: item.price,
          image: item.image,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Remove from wishlist after adding to cart (optional)
      removeFromWishlist(item.id);
      
      // Show success message
      alert('تمت إضافة المنتج إلى سلة التسوق!');
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert('فشل إضافة المنتج إلى سلة التسوق');
    }
  };

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

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">المفضلة فارغة</h1>
            <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى المفضلة بعد</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              استكشف المنتجات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">المفضلة ({wishlist.length} منتجات)</h1>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition"
                  aria-label="إزالة من المفضلة"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>

                {/* Stock Status */}
                {item.inStock === false && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      غير متوفر
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                
                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < item.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="text-emerald-700 font-bold text-lg mb-4">
                  {item.price.toFixed(2)} درهم
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(item)}
                    disabled={item.inStock === false}
                    className="w-full bg-emerald-700 text-white py-2 rounded-lg font-medium hover:bg-emerald-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {item.inStock === false ? 'غير متوفر' : 'أضف إلى السلة'}
                  </button>
                  
                  <Link
                    href={`/products/${item.id}`}
                    className="w-full border border-emerald-700 text-emerald-700 py-2 rounded-lg font-medium hover:bg-emerald-50 transition text-center block"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            استمر في التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
