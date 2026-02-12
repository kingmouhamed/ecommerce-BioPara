"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Truck, 
  Shield, 
  RefreshCw, 
  Heart, 
  Share2, 
  Play, 
  ChevronRight, 
  Check, 
  Globe, 
  Award,
  Package,
  Clock,
  CreditCard
} from 'lucide-react';

interface GlobalProductPageProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    description: string;
    brand: string;
    category: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    features?: string[];
    ingredients?: string[];
    usage?: string[];
    certifications?: string[];
    shipping?: {
      europe: string;
      usa: string;
      gulf: string;
      morocco: string;
    };
  };
}

export default function GlobalProductPage({ product }: GlobalProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const productImages = product.images || [product.image];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const sizes = [
    { id: 'small', name: '30ml', price: product.price * 0.8 },
    { id: 'medium', name: '60ml', price: product.price },
    { id: 'large', name: '100ml', price: product.price * 1.5 }
  ];

  const currentSize = sizes.find(s => s.id === selectedSize);
  const finalPrice = currentSize?.price || product.price;

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      country: "🇬🇧 United Kingdom",
      rating: 5,
      date: "2024-01-15",
      comment: "Amazing quality! Fast delivery to UK. Product is exactly as described."
    },
    {
      id: 2,
      name: "Mohammed Al-Rashid",
      country: "🇸🇦 Saudi Arabia",
      rating: 5,
      date: "2024-01-10",
      comment: "Premium quality argan oil. Arrived quickly to Riyadh. Highly recommend!"
    },
    {
      id: 3,
      name: "Emma Chen",
      country: "🇺🇸 United States",
      rating: 4,
      date: "2024-01-05",
      comment: "Great product! Love the natural ingredients. Shipping took 5 days to California."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600 transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-emerald-600 transition-colors">المنتجات</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-emerald-600 transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-square relative">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    -{discount}%
                  </div>
                )}

                {/* Video Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute bottom-4 left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors"
                >
                  <Play className="w-5 h-5 text-white ml-1" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-emerald-600 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  Bestseller
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price & Currency */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-gray-900">€{finalPrice.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">€{product.originalPrice.toFixed(2)}</span>
              )}
              <div className="trust-badge premium">
                <Globe className="w-3 h-3" />
                <span>Worldwide</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedSize === size.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-600">€{size.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* International Shipping Info */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Worldwide Shipping
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span>Europe:</span>
                  <span className="font-medium">3-5 days</span>
                </div>
                <div className="flex justify-between">
                  <span>USA:</span>
                  <span className="font-medium">5-7 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Gulf:</span>
                  <span className="font-medium">4-6 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Morocco:</span>
                  <span className="font-medium">1-2 days</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full btn-primary text-lg py-4 shadow-lg hover:shadow-xl">
                Add to Cart - €{(finalPrice * quantity).toFixed(2)}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Save
                </button>
                <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-center">
                <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs font-medium">Authentic</div>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs font-medium">Free Shipping €50+</div>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs font-medium">30-Day Returns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'ingredients', 'usage', 'certifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'description' ? 'Description' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                {product.features && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Ingredients</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  {product.ingredients ? (
                    <ul className="space-y-2">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">100% natural ingredients. Full ingredient list available on product packaging.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">How to Use</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  {product.usage ? (
                    <ol className="space-y-3">
                      {product.usage.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-600">Apply small amount to clean skin. Use daily for best results.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'certifications' && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Certifications & Quality</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Award className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-medium">ISO 9001</div>
                      <div className="text-sm text-gray-600">Quality Management</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-8 h-8 text-emerald-600" />
                    <div>
                      <div className="font-medium">GMP Certified</div>
                      <div className="text-sm text-gray-600">Good Manufacturing</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Globe className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-medium">Organic</div>
                      <div className="text-sm text-gray-600">100% Natural</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Package className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-medium">FDA Approved</div>
                      <div className="text-sm text-gray-600">US Standards</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* International Reviews */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="font-medium">{review.name}</div>
                      <div className="text-sm text-gray-500">{review.country}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <div className="mt-3 text-xs text-gray-500">{review.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative aspect-video">
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Product Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
