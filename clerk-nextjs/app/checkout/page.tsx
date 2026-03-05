'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

export default function CheckoutPage() {
  const { cart, calculateSubtotal, calculateTotalWithShipping, calculateShipping, cartItemCount } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItemCount === 0) {
      alert("سلة المشتريات فارغة!")
      return
    }

    const phoneNumber = "212673020264"

    // Format cart items
    const itemsList = cart.map(item => `▪️ ${item.title} (x${item.quantity}) - ${item.price * item.quantity} درهم`).join('\n')

    // Format message
    const message = `✨ *طلب جديد من الموقع* ✨\n\n` +
      `*المنتجات:*\n` +
      `${itemsList}\n\n` +
      `*تكلفة الشحن:* ${calculateShipping() === 0 ? 'مجاني' : calculateShipping() + ' درهم'}\n` +
      `*المجموع الإجمالي:* ${calculateTotalWithShipping().toFixed(2)} درهم\n\n` +
      `*معلومات العميل:*\n` +
      `الاسم: ${formData.firstName} ${formData.lastName}\n` +
      `الهاتف: ${formData.phone}\n` +
      `المدينة: ${formData.city}\n` +
      `العنوان: ${formData.address}\n` +
      `${formData.notes ? `ملاحظات: ${formData.notes}\n` : ''}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            إتمام الطلب
          </h1>
          <p className="text-gray-600">
            أكمل معلوماتك لتأكيد الطلب
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  معلومات الشحن (الدفع عند الاستلام)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الأول *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      اسم العائلة *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف (الواتساب) *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      dir="ltr"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      المدينة *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان الكامل *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  ملاحظات إضافية (اختياري)
                </h2>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="أي ملاحظات خاصة بطلبك..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-emerald-600 font-medium"
                >
                  العودة للمتجر
                </Link>

                <button
                  type="submit"
                  disabled={cartItemCount === 0}
                  className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  إرسال الطلب عبر واتساب
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                ملخص الطلب ({cartItemCount})
              </h2>

              <div className="space-y-4">
                {/* Order Items */}
                <div className="space-y-4 max-h-60 overflow-y-auto pl-2">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4 text-center">السلة فارغة</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-14 h-14 relative bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.quantity} × {item.price} درهم
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المجموع الفرعي:</span>
                    <span className="font-medium text-gray-900">{calculateSubtotal().toFixed(2)} درهم</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">رسوم الشحن:</span>
                    <span className="font-medium text-gray-900">
                      {calculateShipping() === 0 ? 'مجاني' : `${calculateShipping().toFixed(2)} درهم`}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">الإجمالي:</span>
                      <span className="text-lg font-bold text-emerald-600">{calculateTotalWithShipping().toFixed(2)} درهم</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>الدفع آمن عند الاستلام</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
