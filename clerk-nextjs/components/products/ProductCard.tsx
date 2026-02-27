'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product as UnifiedProduct } from '@/data/index';
import { useState, useCallback, useEffect } from 'react';

interface ProductCardProps {
  product: UnifiedProduct;
  onAddToCart?: (product: UnifiedProduct) => void;
  onToggleFavorite?: (productId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(product);
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 2000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setIsAdding(false), 300);
    return () => clearTimeout(timer);
  }, [onAddToCart, product]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(product.id.toString(), !isFavorite);
    }
  }, [onToggleFavorite, product.id, isFavorite]);

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 h-48">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={192}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {product.badge}
            </div>
          )}

          {/* Stock Badge */}
          {product.inStock === false && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              نفد المخزون
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating}</span>
            {product.reviews && (
              <span className="text-sm text-gray-500">({product.reviews} تقييم)</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold text-green-600">{product.price} درهم</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm mr-2">{product.originalPrice} درهم</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.inStock === false}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
                isAdding || product.inStock === false
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? 'جاري الإضافة...' : product.inStock === false ? 'نفد المخزون' : 'أضف للسلة'}
            </button>
            
            <button
              onClick={handleToggleFavorite}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Notification */}
          {showNotification && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg z-10">
              تمت الإضافة للسلة!
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
