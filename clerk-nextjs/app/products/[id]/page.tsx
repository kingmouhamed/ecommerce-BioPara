"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../contexts/CartContext';
import { allProducts, Product } from '../../../data/index';
import GlobalProductPage from '../../../components/GlobalProductPage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = parseInt(params.id as string);
  
  // Find product by ID
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">المنتج غير موجود</h1>
          <p className="text-gray-600 mb-6">المنتج الذي تبحث عنه غير متوفر حالياً</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            العودة للمنتجات
          </button>
        </div>
      </div>
    );
  }

  // Transform product data to global format
  const globalProduct = {
    id: product.id,
    name: product.title || product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    description: product.description || 'Premium natural wellness product from BioPara. Made with the finest ingredients and backed by our quality guarantee.',
    brand: product.brand || 'BioPara',
    category: product.category,
    rating: product.rating || 4.5,
    reviews: 128,
    inStock: true,
    features: [
      '100% Natural Ingredients',
      'Premium Quality',
      'Fast Worldwide Shipping',
      '30-Day Money Back Guarantee'
    ],
    ingredients: [
      'Argan Oil (Argania Spinosa)',
      'Vitamin E (Tocopherol)',
      'Essential Fatty Acids',
      'Natural Antioxidants'
    ],
    usage: [
      'Apply small amount to clean skin',
      'Gently massage in circular motions',
      'Use morning and evening for best results',
      'Suitable for all skin types'
    ],
    certifications: ['ISO 9001', 'GMP', 'Organic', 'FDA Approved'],
    shipping: {
      europe: '3-5 days',
      usa: '5-7 days',
      gulf: '4-6 days',
      morocco: '1-2 days'
    }
  };

  return <GlobalProductPage product={globalProduct} />;
}
