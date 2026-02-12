"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  CreditCard, 
  Shield, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Lock,
  Globe,
  Clock,
  Package,
  RefreshCw
} from 'lucide-react';

export default function GlobalCheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    
    // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Billing Address (same as shipping by default)
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingCountry: '',
    billingPostalCode: ''
  });

  const countries = [
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
    { code: 'FR', name: 'France', currency: 'EUR' },
    { code: 'DE', name: 'Germany', currency: 'EUR' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
    { code: 'MA', name: 'Morocco', currency: 'MAD' }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, MasterCard, Amex' },
    { id: 'paypal', name: 'PayPal', icon: '💰', description: 'Fast & secure' },
    { id: 'apple', name: 'Apple Pay', icon: '🍎', description: 'One-tap payment' },
    { id: 'google', name: 'Google Pay', icon: '🤖', description: 'Quick checkout' }
  ];

  const orderSummary = {
    items: [
      { name: 'Premium Argan Oil', quantity: 2, price: 24.99 },
      { name: 'Natural Herbal Tea', quantity: 1, price: 12.99 }
    ],
    subtotal: 62.97,
    shipping: 0,
    tax: 5.04,
    total: 68.01
  };

  const shippingRates = {
    'US': { standard: 5.99, express: 12.99, free: 75 },
    'GB': { standard: 4.99, express: 9.99, free: 50 },
    'FR': { standard: 4.99, express: 9.99, free: 50 },
    'DE': { standard: 4.99, express: 9.99, free: 50 },
    'AE': { standard: 15.99, express: 25.99, free: 100 },
    'SA': { standard: 12.99, express: 22.99, free: 100 },
    'MA': { standard: 7.99, express: 15.99, free: 60 }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: <Truck className="w-5 h-5" /> },
    { id: 2, name: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
    { id: 3, name: 'Review', icon: <Check className="w-5 h-5" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    router.push('/order-success');
  };

  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          Shipping Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        </div>
      </div>

      {/* International Shipping Info */}
      {formData.country && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h4 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Shipping to {countries.find(c => c.code === formData.country)?.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-medium">Standard</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${shippingRates[formData.country as keyof typeof shippingRates]?.standard || 0}
              </div>
              <div className="text-sm text-gray-600">5-7 business days</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Express</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${shippingRates[formData.country as keyof typeof shippingRates]?.express || 0}
              </div>
              <div className="text-sm text-gray-600">2-3 business days</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Free Shipping</div>
              <div className="text-2xl font-bold text-emerald-600">FREE</div>
              <div className="text-sm text-gray-600">
                Orders over ${shippingRates[formData.country as keyof typeof shippingRates]?.free || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          Payment Method
        </h3>
        
        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {paymentMethods.map(method => (
            <label
              key={method.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.paymentMethod === method.id
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={formData.paymentMethod === method.id}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </div>
              {formData.paymentMethod === method.id && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
              )}
            </label>
          ))}
        </div>

        {/* Credit Card Form */}
        {formData.paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="form-input"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Billing Address */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="sameAsShipping"
              checked={formData.sameAsShipping}
              onChange={handleInputChange}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Billing address same as shipping
            </label>
          </div>
          
          {!formData.sameAsShipping && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Billing Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="form-input"
                />
                <input
                  type="text"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="form-input"
                />
                <select
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="billingPostalCode"
                  value={formData.billingPostalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className="form-input"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-emerald-600" />
          <h4 className="font-semibold text-emerald-800">Secure Payment</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>24/7 Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          Order Review
        </h3>
        
        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {orderSummary.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
              </div>
              <div className="font-medium">${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        {/* Shipping Address */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm">
              {formData.firstName} {formData.lastName}<br />
              {formData.address}<br />
              {formData.city}, {formData.country} {formData.postalCode}<br />
              {formData.email}<br />
              {formData.phone}
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Payment Method</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {paymentMethods.find(m => m.id === formData.paymentMethod)?.icon}
              </span>
              <div>
                <div className="font-medium">
                  {paymentMethods.find(m => m.id === formData.paymentMethod)?.name}
                </div>
                {formData.paymentMethod === 'card' && formData.cardNumber && (
                  <div className="text-sm text-gray-600">
                    **** **** **** {formData.cardNumber.slice(-4)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Terms */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1" />
            <span className="text-sm text-emerald-700">
              I agree to the Terms of Service and Privacy Policy. I understand that this order is subject to the return policy.
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`font-medium ${
                      currentStep >= step.id ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderShippingStep()}
                {currentStep === 2 && renderPaymentStep()}
                {currentStep === 3 && renderReviewStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-primary flex items-center gap-2"
                    >
                      Complete Purchase
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {orderSummary.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-emerald-600">
                      {orderSummary.shipping === 0 ? 'FREE' : `$${orderSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${orderSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-emerald-600">${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Worldwide Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RefreshCw className="w-4 h-4 text-emerald-600" />
                      <span>30-Day Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
