'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'MA',
    
    // Payment Information
    paymentMethod: 'cod', // Cash on Delivery
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    
    // Order Notes
    notes: ''
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // TODO: Implement actual checkout logic
      console.log('Processing order:', formData)
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to success page
      // router.push('/order-success')
      
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const orderTotal = 493.00 // This should come from cart

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
                  معلومات الشحن
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      الرمز البريدي
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      الدولة *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MA">المغرب</option>
                      <option value="DZ">الجزائر</option>
                      <option value="TN">تونس</option>
                      <option value="EG">مصر</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  طريقة الدفع
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="ml-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="mr-3">
                      <div className="font-medium text-gray-900">الدفع عند الاستلام</div>
                      <div className="text-sm text-gray-500">ادفع عند استلام الطلب</div>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="ml-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="mr-3">
                      <div className="font-medium text-gray-900">بطاقة ائتمان</div>
                      <div className="text-sm text-gray-500">الدفع الآمن بالبطاقة</div>
                    </div>
                  </label>
                </div>

                {/* Card Details - Show only if card payment is selected */}
                {formData.paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4 border-t pt-6">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم على البطاقة *
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        رقم البطاقة *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                          تاريخ الانتهاء *
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cardCvv"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  ملاحظات الطلب
                </h2>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="أي ملاحظات خاصة بطلبك..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  العودة للسلة
                </Link>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري المعالجة...
                    </span>
                  ) : (
                    'تأكيد الطلب'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                ملخص الطلب
              </h2>

              <div className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">عسل الأزهار البرية</div>
                      <div className="text-sm text-gray-500">2 × 159.00 MAD</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">عسل الأكاسيا</div>
                      <div className="text-sm text-gray-500">1 × 175.00 MAD</div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المجموع الفرعي:</span>
                    <span className="font-medium text-gray-900">493.00 MAD</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الشحن:</span>
                    <span className="font-medium text-gray-900">مجاني</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الضريبة:</span>
                    <span className="font-medium text-gray-900">0.00 MAD</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">المجموع:</span>
                      <span className="text-lg font-bold text-gray-900">{orderTotal.toFixed(2)} MAD</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>دفع آمن ومشفر</span>
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
