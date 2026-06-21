'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    calculateSubtotal,
    calculateTotalWithShipping,
    calculateShipping,
    cartItemCount
  } = useCart()

  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "212673020264";
    
    // Format cart summary message in Arabic RTL
    let message = `السلام عليكم! أرغب في إكمال هذا الطلب:\n\n`;
    
    cart.forEach((item, index) => {
      message += `📦 *${index + 1}. ${item.title}*\n`;
      message += `   السعر: ${item.price.toFixed(2)} درهم\n`;
      message += `   الكمية: ${item.quantity}\n`;
      message += `   المجموع: ${(item.price * item.quantity).toFixed(2)} درهم\n\n`;
    });

    message += `-------------------------\n`;
    message += `💰 *المجموع الفرعي:* ${calculateSubtotal().toFixed(2)} درهم\n`;
    message += `🚚 *الشحن:* ${calculateShipping() === 0 ? 'مجاني' : `${calculateShipping().toFixed(2)} درهم`}\n`;
    message += `💵 *الإجمالي الكلي:* ${calculateTotalWithShipping().toFixed(2)} درهم\n\n`;
    message += `الرجاء تأكيد الطلب وتحديد معلومات التوصيل.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!mounted) {
    return null
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
        <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag className="w-16 h-16" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          سلة التسوق فارغة
        </h1>

        <p className="text-gray-600 mb-8 max-w-md text-center text-lg">
          لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. اكتشف منتجاتنا الطبيعية المميزة للبدء.
        </p>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
        >
          تصفح المنتجات
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          سلة التسوق ({cartItemCount})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 relative group transition-all hover:shadow-md">

                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
                  <Image
                    src={item.image || '/images/products/product-placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Details & Actions */}
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-col text-center sm:text-right">
                    <Link
                      href={`/products/${item.slug || item.id}`}
                      className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors mb-2 line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <div className="text-emerald-600 font-bold text-lg mb-4 sm:mb-0">
                      {item.price.toFixed(2)} درهم
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                    <div className="flex flex-col items-center sm:items-end gap-3">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded-md transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal Total for Mobile */}
                <div className="sm:hidden w-full pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">المجموع الفرعي:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} درهم
                  </span>
                </div>

                {/* Subtotal Total for Desktop */}
                <div className="hidden sm:flex flex-col items-end mr-6 pr-6 border-r border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">المجموع</div>
                  <div className="text-xl font-bold text-gray-900 leading-none">
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">درهم</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع ({cartItemCount} منتجات)</span>
                  <span className="font-bold text-gray-900">
                    {calculateSubtotal().toFixed(2)} درهم
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>تكلفة الشحن</span>
                  <span className={`font-bold ${calculateShipping() === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {calculateShipping() === 0 ? 'مجاني' : `${calculateShipping().toFixed(2)} درهم`}
                  </span>
                </div>

                {calculateShipping() > 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mt-2">
                    احصل على شحن مجاني للطلبات فوق 299 درهم
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    الإجمالي المطلوب
                  </span>
                  <span className="text-3xl font-bold text-emerald-600">
                    {calculateTotalWithShipping().toFixed(2)} درهم
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex justify-center items-center gap-2 px-6 py-4 text-lg font-bold rounded-xl text-white bg-[#25D366] hover:bg-[#128C7E] transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  <svg className="w-5.5 h-5.5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>أكمل الطلب عبر واتساب</span>
                </button>

            <Link
                  href="/products"
                  className="w-full flex justify-center items-center px-6 py-4 text-lg font-bold rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                >
                  متابعة التسوق
            </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
