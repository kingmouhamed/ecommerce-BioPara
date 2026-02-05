"use client";

import React, { useState } from "react";
import { User, MapPin, Phone, CreditCard, Truck, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  type: "card" | "cash" | "bank";
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cardName?: string;
}

interface CheckoutFormProps {
  onSubmit: (data: { shipping: ShippingAddress; payment: PaymentMethod }) => Promise<void>;
  loading?: boolean;
  error?: string;
  initialData?: Partial<ShippingAddress>;
  className?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  loading = false,
  error,
  initialData = {},
  className = "",
}) => {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "المغرب",
    ...initialData,
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "card",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentChange = (field: keyof PaymentMethod, value: string) => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate shipping address
    if (!shippingAddress.fullName.trim()) {
      errors.fullName = "الاسم الكامل مطلوب";
    }

    if (!shippingAddress.email) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }

    if (!shippingAddress.phone) {
      errors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[+]?[\d\s-()]+$/.test(shippingAddress.phone)) {
      errors.phone = "رقم الهاتف غير صالح";
    }

    if (!shippingAddress.address.trim()) {
      errors.address = "العنوان مطلوب";
    }

    if (!shippingAddress.city.trim()) {
      errors.city = "المدينة مطلوبة";
    }

    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = "الرمز البريدي مطلوب";
    }

    // Validate payment method
    if (paymentMethod.type === "card") {
      if (!paymentMethod.cardNumber?.trim()) {
        errors.cardNumber = "رقم البطاقة مطلوب";
      } else if (!/^\d{16}$/.test(paymentMethod.cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "رقم البطاقة غير صالح";
      }

      if (!paymentMethod.cardExpiry?.trim()) {
        errors.cardExpiry = "تاريخ الانتهاء مطلوب";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentMethod.cardExpiry)) {
        errors.cardExpiry = "التاريخ غير صالح (MM/YY)";
      }

      if (!paymentMethod.cardCVV?.trim()) {
        errors.cardCVV = "CVV مطلوب";
      } else if (!/^\d{3,4}$/.test(paymentMethod.cardCVV)) {
        errors.cardCVV = "CVV غير صالح";
      }

      if (!paymentMethod.cardName?.trim()) {
        errors.cardName = "الاسم على البطاقة مطلوب";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || loading) return;

    try {
      await onSubmit({ shipping: shippingAddress, payment: paymentMethod });
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
        {/* Shipping Address Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">عنوان الشحن</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="text"
                label="الاسم الكامل"
                value={shippingAddress.fullName}
                onChange={(e) => handleShippingChange("fullName", e.target.value)}
                error={!!fieldErrors.fullName}
                helperText={fieldErrors.fullName}
                required
                placeholder="أدخل اسمك الكامل"
                className="text-right"
                leftIcon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                type="email"
                label="البريد الإلكتروني"
                value={shippingAddress.email}
                onChange={(e) => handleShippingChange("email", e.target.value)}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                required
                placeholder="example@email.com"
                className="text-right"
                leftIcon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                type="tel"
                label="رقم الهاتف"
                value={shippingAddress.phone}
                onChange={(e) => handleShippingChange("phone", e.target.value)}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                required
                placeholder="+212 600-000-000"
                className="text-right"
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                type="text"
                label="المدينة"
                value={shippingAddress.city}
                onChange={(e) => handleShippingChange("city", e.target.value)}
                error={!!fieldErrors.city}
                helperText={fieldErrors.city}
                required
                placeholder="الدار البيضاء"
                className="text-right"
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                type="text"
                label="العنوان التفصيلي"
                value={shippingAddress.address}
                onChange={(e) => handleShippingChange("address", e.target.value)}
                error={!!fieldErrors.address}
                helperText={fieldErrors.address}
                required
                placeholder="الشارع، رقم المبنى، الطابق"
                className="text-right"
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                type="text"
                label="الرمز البريدي"
                value={shippingAddress.postalCode}
                onChange={(e) => handleShippingChange("postalCode", e.target.value)}
                error={!!fieldErrors.postalCode}
                helperText={fieldErrors.postalCode}
                required
                placeholder="10000"
                className="text-right"
              />
            </div>

            <div>
              <Input
                type="text"
                label="البلد"
                value={shippingAddress.country}
                onChange={(e) => handleShippingChange("country", e.target.value)}
                required
                className="text-right"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">طريقة الدفع</h2>
          </div>

          <div className="space-y-4">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="payment-type"
                  value="card"
                  checked={paymentMethod.type === "card"}
                  onChange={() => setPaymentMethod(prev => ({ ...prev, type: "card" }))}
                  className="sr-only"
                />
                <div className={`border-2 rounded-lg p-4 text-center transition-colors ${
                  paymentMethod.type === "card"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <span className="text-sm font-medium">بطاقة ائتمان</span>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="payment-type"
                  value="cash"
                  checked={paymentMethod.type === "cash"}
                  onChange={() => setPaymentMethod(prev => ({ ...prev, type: "cash" }))}
                  className="sr-only"
                />
                <div className={`border-2 rounded-lg p-4 text-center transition-colors ${
                  paymentMethod.type === "cash"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <Truck className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <span className="text-sm font-medium">الدفع عند الاستلام</span>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="payment-type"
                  value="bank"
                  checked={paymentMethod.type === "bank"}
                  onChange={() => setPaymentMethod(prev => ({ ...prev, type: "bank" }))}
                  className="sr-only"
                />
                <div className={`border-2 rounded-lg p-4 text-center transition-colors ${
                  paymentMethod.type === "bank"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <span className="text-sm font-medium">تحويل بنكي</span>
                </div>
              </label>
            </div>

            {/* Card Payment Form */}
            {paymentMethod.type === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    label="رقم البطاقة"
                    value={paymentMethod.cardNumber || ""}
                    onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                    error={!!fieldErrors.cardNumber}
                    helperText={fieldErrors.cardNumber}
                    required
                    placeholder="1234 5678 9012 3456"
                    className="text-right"
                    leftIcon={<CreditCard className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    label="تاريخ الانتهاء"
                    value={paymentMethod.cardExpiry || ""}
                    onChange={(e) => handlePaymentChange("cardExpiry", e.target.value)}
                    error={!!fieldErrors.cardExpiry}
                    helperText={fieldErrors.cardExpiry}
                    required
                    placeholder="MM/YY"
                    className="text-right"
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    label="CVV"
                    value={paymentMethod.cardCVV || ""}
                    onChange={(e) => handlePaymentChange("cardCVV", e.target.value)}
                    error={!!fieldErrors.cardCVV}
                    helperText={fieldErrors.cardCVV}
                    required
                    placeholder="123"
                    className="text-right"
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    type="text"
                    label="الاسم على البطاقة"
                    value={paymentMethod.cardName || ""}
                    onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                    error={!!fieldErrors.cardName}
                    helperText={fieldErrors.cardName}
                    required
                    placeholder="الاسم كما يظهر على البطاقة"
                    className="text-right"
                    leftIcon={<User className="w-4 h-4" />}
                  />
                </div>
              </div>
            )}

            {/* Cash Payment Info */}
            {paymentMethod.type === "cash" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  سيتم الدفع نقداً عند استلام الطلب. يرجى التأكد من وجود المبلغ الكامل.
                </p>
              </div>
            )}

            {/* Bank Transfer Info */}
            {paymentMethod.type === "bank" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  سيتم إرسال تفاصيل التحويل البنكي عبر البريد الإلكتروني بعد تأكيد الطلب.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          fullWidth
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? "جاري معالجة الطلب..." : "إتمام الطلب"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
