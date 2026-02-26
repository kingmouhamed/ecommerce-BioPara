"use client";

import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Heart, Star, Eye, ShoppingCart, Package, Shield, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../ui/Toast';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  badge?: string;
  tags: string[];
}

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const QuickView: React.FC<QuickViewProps> = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedImage(0);
      setIsWishlisted(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      addToCart(product, quantity);
      addToast({
        type: 'success',
        title: 'تمت الإضافة للسلة',
        message: `${product.title} تمت إضافته بنجاح إلى سلة التسوق`
      });
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطأ',
        message: 'حدث خطأ أثناء إضافة المنتج للسلة'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    addToast({
      type: isWishlisted ? 'success' : 'info',
      title: isWishlisted ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة',
      message: `${product.title} ${isWishlisted ? 'تمت إزالته' : 'تمت إضافته'} ${isWishlisted ? 'من' : 'إلى'} المفضلة`
    });
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                        <span className="text-white font-medium text-lg">نفد المخزون</span>
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  <div className="flex space-x-2 space-x-reverse">
                    {[0, 1, 2, 3].map((index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          'w-20 h-20 border-2 rounded-lg overflow-hidden transition-colors',
                          selectedImage === index
                            ? 'border-emerald-600'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <Image
                          src={product.image}
                          alt={`${product.title} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Title and Brand */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                    {product.brand && (
                      <p className="text-gray-600">{product.brand}</p>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={cn(
                            'w-5 h-5',
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          )}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.reviewCount} تقييم)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-3xl font-bold text-emerald-600">
                        {product.price.toFixed(2)} د.م
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {product.originalPrice.toFixed(2)} د.م
                        </span>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}>
                      {product.inStock ? 'متوفر' : 'نفد المخزون'}
                    </span>
                    {product.stockCount && product.inStock && (
                      <span className="text-sm text-gray-600">
                        ({product.stockCount} قطعة متاحة)
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
                    <p className="text-gray-600 leading-relaxed">
                      منتج عالي الجودة مصمم لتلبية احتياجاتك اليومية. يتميز بالجودة الفائقة والمتانة العالية.
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">التصنيفات</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">الكمية</h3>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={!product.inStock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-600">
                        المجموع: {(product.price * quantity).toFixed(2)} د.م
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock || loading}
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                          <span>جاري التحميل...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>أضف للسلة</span>
                        </>
                      )}
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleWishlist}
                        className="flex items-center justify-center space-x-2 space-x-reverse border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Heart className={cn('w-4 h-4', isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600')} />
                        <span>{isWishlisted ? 'في المفضلة' : 'أضف للمفضلة'}</span>
                      </button>

                      <Link
                        href={`/products/${product.id}`}
                        onClick={onClose}
                        className="flex items-center justify-center space-x-2 space-x-reverse border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span>عرض التفاصيل</span>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <Package className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs text-gray-600">شحن آمن</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <Shield className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs text-gray-600">ضمان الجودة</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <RefreshCw className="w-6 h-6 text-emerald-600" />
                        <span className="text-xs text-gray-600">استرجاع سهل</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickView;
