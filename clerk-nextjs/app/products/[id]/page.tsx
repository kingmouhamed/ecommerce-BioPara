"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../contexts/CartContext';
import { allProducts, Product } from '../../../data/index';
import { getParapharmacieImage } from '../../../data/parapharmacie-images';
import { getHerbalImage } from '../../../data/herbal-images';
import { ArrowRight, ShoppingCart, Heart, Star, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find((p: Product) => p.id === parseInt(params.id as string));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
            <p className="text-gray-600 mb-8">المنتج الذي تبحث عنه غير متوفر حالياً.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl transition-colors"
            >
              العودة للمنتجات
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productImage = product.category === 'parapharmacie' 
    ? getParapharmacieImage(product.id)
    : getHerbalImage(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Fallback image if no image found
  const imageSrc = productImage?.imageUrl || '/images/placeholders/product-placeholder.jpg';

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative w-full h-96 bg-white rounded-2xl overflow-hidden mb-4">
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-emerald-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={imageSrc}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 mr-2">(4.5)</span>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{product.price} DH</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">ضمان الجودة</span>
                </div>
                <p className="text-sm text-gray-600">منتجات أصلية ومضمونة</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Truck className="w-5 h-5" />
                  <span className="font-semibold">توصيل سريع</span>
                </div>
                <p className="text-sm text-gray-600">استلام خلال 2-3 أيام</p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <label className="font-semibold text-gray-900">الكمية:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  الإجمالي: {(product.price * quantity).toFixed(2)} DH
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                أضف إلى السلة
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-2xl border border-gray-200 transition-colors flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                إضافة للمفضلة
              </button>
              <Link
                href="/cart"
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                عرض السلة
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
