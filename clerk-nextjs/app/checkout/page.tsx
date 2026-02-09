"use client";

import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import { Truck, Shield, CreditCard, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const { cart, calculateTotal, cartItemCount, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">سلة التسوق فارغة</h1>
            <p className="text-gray-600 mb-8">
              أضف منتجات إلى سلة التسوق للمتابعة
            </p>
            <Link
              href="/products"
              className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              استكشف المنتجات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingCost = shippingMethod === "express" ? 30 : 0;
  const total = parseFloat(calculateTotal()) + shippingCost;

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      clearCart();
      setOrderSuccess(true);
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        window.location.href = '/order-success';
      }, 2000);
      
    } catch (error) {
      console.error('Order processing error:', error);
      alert('حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">إتمام الطلب</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                معلومات الشحن
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="الشارع، المدينة، الرمز البريدي"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة *
                  </label>
                  <select id="city" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">اختر المدينة</option>
                    <option value="casablanca">الدار البيضاء</option>
                    <option value="rabat">الرباط</option>
                    <option value="marrakech">مراكش</option>
                    <option value="fes">فاس</option>
                    <option value="tangier">طنجة</option>
                    <option value="agadir">أكادير</option>
                    <option value="meknes">مكناس</option>
                    <option value="oujda">وجدة</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرمز البريدي *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="XXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-700" />
                طريقة الشحن
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-emerald-700"
                    />
                    <div>
                      <div className="font-medium">التوصيل القياسي</div>
                      <div className="text-sm text-gray-500">3-5 أيام عمل</div>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600">مجاني</span>
                </label>
                
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-emerald-700"
                    />
                    <div>
                      <div className="font-medium">التوصيل السريع</div>
                      <div className="text-sm text-gray-500">1-2 أيام عمل</div>
                    </div>
                  </div>
                  <span className="font-bold">30.00 درهم</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                طريقة الدفع
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-emerald-700"
                  />
                  <div>
                    <div className="font-medium">الدفع عند الاستلام</div>
                    <div className="text-sm text-gray-500">الدفع نقداً عند استلام الطلب</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-emerald-700"
                  />
                  <div>
                    <div className="font-medium">بطاقة ائتمانية</div>
                    <div className="text-sm text-gray-500">دفع آمن عبر البطاقة البنكية</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">ملخص الطلب</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-gray-500 text-xs">الكمية: {item.quantity}</div>
                    </div>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2)} درهم
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span>{calculateTotal()} درهم</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الشحن</span>
                  <span>{shippingCost === 0 ? "مجاني" : shippingCost + ".00 درهم"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الضريبة</span>
                  <span>شامل</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع</span>
                    <span className="text-emerald-700">{total.toFixed(2)} درهم</span>
                  </div>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري معالجة الطلب...
                  </div>
                ) : (
                  'تأكيد الطلب'
                )}
              </button>
              
              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>شراء آمن ومضمون</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
