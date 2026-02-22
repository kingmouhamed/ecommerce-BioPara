"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Leaf, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, calculateTotal, cartItemCount } =
    useCart();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              BioPara
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">المنتجات</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">اتصل بنا</Link>
            </nav>
            <Link href="/cart" className="p-2 text-primary-600 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {cart.length === 0 ? (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              سلة التسوق فارغة
            </h1>
            <p className="text-gray-600 mb-8">
              لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
            </p>
            <Link
              href="/products"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              تسوق الآن
            </Link>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {"سلة التسوق ("}{cartItemCount}{" منتجات)"}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 border-b last:border-b-0">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-primary-600 font-bold text-lg mb-3">
                          {item.price.toFixed(2)} درهم
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-2 hover:bg-gray-100 transition"
                              aria-label="تقليل الكمية"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
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
                      <div className="text-left">
                        <p className="text-sm text-gray-500">المجموع الفرعي</p>
                        <p className="font-bold text-gray-800">
                          {(item.price * item.quantity).toFixed(2)} درهم
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
                >
                  {"← استمر في التسوق"}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  ملخص الطلب
                </h2>
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span className="font-medium">
                      {calculateTotal()} درهم
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-medium text-primary-600">مجاني</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>المجموع</span>
                      <span className="text-primary-600">
                        {calculateTotal()} درهم
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition text-center block"
                >
                  إتمام الطلب
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
