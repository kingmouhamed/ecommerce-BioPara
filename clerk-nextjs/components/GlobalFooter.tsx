"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, 
  Shield, 
  Truck, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Award,
  Users,
  Clock
} from 'lucide-react';

export default function GlobalFooter() {
  const currentYear = new Date().getFullYear();

  const trustSignals = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "ISO Certified",
      description: "Quality Assured"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "GMP Certified",
      description: "Good Manufacturing"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "50+ Countries",
      description: "Global Delivery"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "1M+ Customers",
      description: "Trusted Worldwide"
    }
  ];

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "MasterCard", icon: "💳" },
    { name: "PayPal", icon: "💳" },
    { name: "Apple Pay", icon: "🍎" },
    { name: "Google Pay", icon: "🤖" }
  ];

  const shippingInfo = [
    { country: "Europe", time: "3-5 days", price: "Free €50+" },
    { country: "USA", time: "5-7 days", price: "Free $75+" },
    { country: "Gulf", time: "4-6 days", price: "Free 250 AED+" },
    { country: "Morocco", time: "1-2 days", price: "Free 200 MAD+" }
  ];

  return (
    <footer className="bg-neutral-dark text-neutral-white">
      {/* Trust Signals Bar */}
      <div className="bg-emerald-700 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="text-emerald-200">{signal.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{signal.title}</div>
                  <div className="text-xs text-emerald-200">{signal.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="BioPara"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold">BioPara</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Premium natural wellness products delivered worldwide. 
              From Morocco to the world, bringing nature's best to your doorstep.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-emerald-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Global Newsletter</h4>
              <p className="text-sm text-gray-300 mb-3">Get exclusive offers & wellness tips</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-emerald-700 border border-emerald-600 rounded text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400"
                />
                <button className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-emerald-400 transition-colors">All Products</Link></li>
              <li><Link href="/brands" className="text-gray-300 hover:text-emerald-400 transition-colors">Brands</Link></li>
              <li><Link href="/promotions" className="text-gray-300 hover:text-emerald-400 transition-colors">Special Offers</Link></li>
              <li><Link href="/new-arrivals" className="text-gray-300 hover:text-emerald-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="/bestsellers" className="text-gray-300 hover:text-emerald-400 transition-colors">Bestsellers</Link></li>
              <li><Link href="/gift-sets" className="text-gray-300 hover:text-emerald-400 transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-emerald-400 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-emerald-400 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-emerald-400 transition-colors">FAQ</Link></li>
              <li><Link href="/size-guide" className="text-gray-300 hover:text-emerald-400 transition-colors">Size Guide</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-emerald-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-gray-300 hover:text-emerald-400 transition-colors">Sustainability</Link></li>
              <li><Link href="/certifications" className="text-gray-300 hover:text-emerald-400 transition-colors">Certifications</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-emerald-400 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-emerald-400 transition-colors">Press</Link></li>
              <li><Link href="/wholesale" className="text-gray-300 hover:text-emerald-400 transition-colors">Wholesale</Link></li>
            </ul>
          </div>
        </div>

        {/* International Shipping Info */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h4 className="font-semibold text-lg mb-4 text-center">International Shipping</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {shippingInfo.map((info, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="font-semibold mb-1">{info.country}</div>
                <div className="text-sm text-gray-300 mb-1">{info.time}</div>
                <div className="text-emerald-400 font-medium">{info.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-semibold mb-2">Secure Payment Methods</h4>
              <div className="flex gap-3">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-sm">
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">SSL Secured Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} BioPara. All rights reserved. Premium Natural Wellness Worldwide.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-emerald-400 transition-colors">Cookie Policy</Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-emerald-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
