"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ShoppingCart,
  Truck,
  CreditCard,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const { cart, cartItemCount, calculateTotal, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("cash");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    router.push("/order-success");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            سلة التسوق فارغة
          </h1>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = parseFloat(calculateTotal());
  const shipping = subtotal > 300 ? 0 : 30;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              BioPara
            </Link>
            <span className="text-gray-600 font-medium">إتمام الطلب</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الطلب</h1>
        <p className="text-gray-600 mb-8">
          {"لديك"} {cartItemCount} {"منتجات في سلة التسوق"}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Form */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    عنوان الشحن
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="الاسم الكامل"
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="البريد الإلكتروني"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+212 6XX-XXXXXX"
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="المدينة"
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="العنوان التفصيلي"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    طريقة الدفع
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="sr-only"
                    />
                    <div
                      className={`border-2 rounded-lg p-4 text-center transition-colors ${
                        paymentMethod === "cash"
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Truck className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        الدفع عند الاستلام
                      </span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="sr-only"
                    />
                    <div
                      className={`border-2 rounded-lg p-4 text-center transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        بطاقة ائتمان
                      </span>
                    </div>
                  </label>
                </div>
                {paymentMethod === "cash" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      سيتم الدفع نقدا عند استلام الطلب.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <ShoppingCart className="w-5 h-5" />
                  {"ملخص الطلب ("}{cartItemCount}{" منتجات)"}
                </h2>

                <div className="max-h-64 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {"x"}{item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary-600">
                        {(item.price * item.quantity).toFixed(2)} درهم
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span className="font-medium">{subtotal.toFixed(2)} درهم</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-medium">
                      {shipping === 0 ? "مجاني" : `${shipping.toFixed(2)} درهم`}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        المجموع الكلي
                      </span>
                      <span className="text-lg font-bold text-primary-600">
                        {total.toFixed(2)} درهم
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mt-6"
                >
                  تأكيد الطلب
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
