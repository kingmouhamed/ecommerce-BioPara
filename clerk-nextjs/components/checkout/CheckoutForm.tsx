"use client";

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Lock } from 'lucide-react';
import { Form, NameInput, EmailInput, PhoneInput, AddressInput, CardInput } from '../ui/Form';

interface CheckoutFormProps {
  onSubmit: (data: any) => void;
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    postalCode: '',
    country: 'المملكة العربية السعودية',
    
    // Payment Information
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
    
    // Order Notes
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (data: any) => {
    // Combine form data with additional fields
    const orderData = {
      ...data,
      ...formData,
      notes: formData.notes
    };
    onSubmit(orderData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formFields = [
    // Personal Information
    {
      name: 'firstName',
      label: 'الاسم الأول',
      type: 'text' as const,
      required: true,
      placeholder: 'أدخل اسمك الأول'
    },
    {
      name: 'lastName',
      label: 'اسم العائلة',
      type: 'text' as const,
      required: true,
      placeholder: 'أدخل اسم العائلة'
    },
    {
      name: 'email',
      label: 'البريد الإلكتروني',
      type: 'email' as const,
      required: true,
      placeholder: 'example@email.com',
      validation: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'البريد الإلكتروني غير صحيح' : null;
      }
    },
    {
      name: 'phone',
      label: 'رقم الهاتف',
      type: 'tel' as const,
      required: true,
      placeholder: '+966 5X XXX XXXX'
    },
    
    // Shipping Address
    {
      name: 'address',
      label: 'العنوان',
      type: 'text' as const,
      required: true,
      placeholder: 'أدخل عنوانك الكامل'
    },
    {
      name: 'city',
      label: 'المدينة',
      type: 'text' as const,
      required: true,
      placeholder: 'أدخل مدينتك'
    },
    {
      name: 'postalCode',
      label: 'الرمز البريدي',
      type: 'text' as const,
      required: true,
      placeholder: 'أدخل الرمز البريدي'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">معلومات الدفع والتوصيل</h2>
      
      <Form
        fields={formFields}
        onSubmit={handleSubmit}
        submitText="إتمام الطلب"
        className="space-y-6"
      />

      {/* Order Notes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ملاحظات الطلب (اختياري)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="أي ملاحظات خاصة بالطلب..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Payment Method */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">طريقة الدفع</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 space-x-reverse">
            <input
              type="radio"
              name="payment"
              value="card"
              defaultChecked
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-gray-700">بطاقة ائتمانية</span>
          </label>
          <label className="flex items-center space-x-3 space-x-reverse">
            <input
              type="radio"
              name="payment"
              value="cod"
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-gray-700">الدفع عند الاستلام</span>
          </label>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
        <Lock className="w-4 h-4" />
        <span>معلوماتك آمنة ومشفرة</span>
      </div>
    </div>
  );
}
