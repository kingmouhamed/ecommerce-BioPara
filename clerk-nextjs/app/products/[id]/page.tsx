"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../contexts/CartContext';
import { allProducts, Product } from '../../../data/index';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = parseInt(params.id as string);
  
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
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
  
  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
  };
  
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => router.push('/')} className="hover:text-emerald-600">الرئيسية</button>
          <span>/</span>
          <button onClick={() => router.push('/products')} className="hover:text-emerald-600">المنتجات</button>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-emerald-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              {/* Brand Logo */}
              {product.brand && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-600">العلامة التجارية:</span>
                  {product.brand === 'CeraVe' ? (
                    <img 
                      src="/images/brands/cerave-logo.png" 
                      alt="CeraVe" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Uriage' ? (
                    <img 
                      src="/images/brands/uriage-logo.png" 
                      alt="Uriage" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Nuxe' ? (
                    <img 
                      src="/images/brands/nuxe-logo.png" 
                      alt="Nuxe" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'La Roche-Posay' ? (
                    <img 
                      src="/images/brands/la-roche-posay-logo.png" 
                      alt="La Roche-Posay" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Vichy' ? (
                    <img 
                      src="/images/brands/vichy-logo.png" 
                      alt="Vichy" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Bioderma' ? (
                    <img 
                      src="/images/brands/bioderma-logo.png" 
                      alt="Bioderma" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Avène' ? (
                    <img 
                      src="/images/brands/avene-logo.png" 
                      alt="Avène" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Mustela' ? (
                    <img 
                      src="/images/brands/mustela-logo.png" 
                      alt="Mustela" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Filorga' ? (
                    <img 
                      src="/images/brands/filorga-logo.png" 
                      alt="Filorga" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'SVR' ? (
                    <img 
                      src="/images/brands/svr-logo.png" 
                      alt="SVR" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'Eucerin' ? (
                    <img 
                      src="/images/brands/eucerin-logo.png" 
                      alt="Eucerin" 
                      className="h-8 object-contain"
                    />
                  ) : product.brand === 'BioOriental' ? (
                    <img 
                      src="/images/brands/bio-oriental-logo.png" 
                      alt="BioOriental" 
                      className="h-8 object-contain"
                    />
                  ) : (
                    <span className="font-medium text-gray-800">{product.brand}</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-emerald-600">{product.price} درهم</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">{product.originalPrice} درهم</span>
                )}
                {product.badge && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {product.badge}
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating} (128 تقييم)</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="prose prose-sm">
              <h3 className="text-lg font-semibold mb-2">وصف المنتج</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'منتج عالي الجودة من BioPara، مضمون للأصالة والفعالية. مناسب للاستخدام اليومي مع نتائج مذهلة.'}
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-3">المميزات</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">ضمان الجودة الأصلية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">شحن سريع في جميع أنحاء المغرب</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">إرجاع خلال 7 أيام</span>
                </div>
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">الكمية:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                  />
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  إضافة للسلة
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">منتجات ذات صلة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                    {relatedProduct.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">{relatedProduct.price} درهم</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 mr-1">{relatedProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
