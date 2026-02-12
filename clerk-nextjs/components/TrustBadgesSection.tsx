"use client";

import React from 'react';
import { 
  Shield, 
  Award, 
  Truck, 
  CreditCard, 
  Users, 
  Globe, 
  Clock, 
  CheckCircle,
  Star,
  Lock,
  RefreshCw
} from 'lucide-react';

export default function TrustBadgesSection() {
  const certifications = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "ISO 9001 Certified",
      description: "International Quality Management Standard",
      color: "text-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "GMP Certified",
      description: "Good Manufacturing Practices",
      color: "text-emerald-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Organic Certified",
      description: "100% Natural Organic Ingredients",
      color: "text-green-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "FDA Approved",
      description: "Meets US Food & Drug Standards",
      color: "text-purple-600"
    }
  ];

  const guarantees = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Worldwide Shipping",
      description: "Free delivery on orders over $50",
      delay: "3-7 business days"
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "30-Day Returns",
      description: "Money back guarantee",
      note: "No questions asked"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Payment",
      description: "SSL encrypted transactions",
      note: "Multiple payment options"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Global customer service",
      note: "Multilingual assistance"
    }
  ];

  const stats = [
    { number: "1M+", label: "Happy Customers", icon: <Users className="w-5 h-5" /> },
    { number: "50+", label: "Countries", icon: <Globe className="w-5 h-5" /> },
    { number: "4.9/5", label: "Average Rating", icon: <Star className="w-5 h-5" /> },
    { number: "15+", label: "Years Experience", icon: <Award className="w-5 h-5" /> }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <CheckCircle className="w-4 h-4" />
            <span>Why Choose BioPara</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Our commitment to quality, safety, and customer satisfaction has made us 
            the preferred choice for natural wellness products globally.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                {stat.icon}
                <span className="text-3xl font-bold">{stat.number}</span>
              </div>
              <div className="text-neutral-medium font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-neutral-dark mb-8 text-center">
            International Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="card text-center p-6">
                <div className={`${cert.color} mb-4 flex justify-center`}>
                  {cert.icon}
                </div>
                <h4 className="font-bold text-neutral-dark mb-2">{cert.title}</h4>
                <p className="text-sm text-neutral-medium">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-neutral-dark mb-8 text-center">
            Our Promises to You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <div className="text-emerald-600">{guarantee.icon}</div>
                </div>
                <h4 className="font-bold text-neutral-dark mb-2">{guarantee.title}</h4>
                <p className="text-sm text-neutral-medium mb-1">{guarantee.description}</p>
                {guarantee.note && (
                  <p className="text-xs text-emerald-600 font-medium">{guarantee.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Security */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-neutral-dark mb-6">
            Secure & Flexible Payment Options
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <div className="trust-badge premium">
              <CreditCard className="w-4 h-4" />
              <span>Visa & MasterCard</span>
            </div>
            <div className="trust-badge premium">
              <span>💳</span>
              <span>PayPal</span>
            </div>
            <div className="trust-badge premium">
              <span>🍎</span>
              <span>Apple Pay</span>
            </div>
            <div className="trust-badge premium">
              <span>🤖</span>
              <span>Google Pay</span>
            </div>
            <div className="trust-badge premium">
              <span>💰</span>
              <span>Crypto</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-medium">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>24/7 Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
