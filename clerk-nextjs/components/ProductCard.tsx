'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Tables } from '@/lib/supabase-client';
import { useState } from 'react';

interface ProductCardProps {
  product: Tables['products'];
  onAddToCart?: (product: Tables['products']) => void;
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(product);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(product.id, !isFavorite);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 h-48">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />

          {/* Badge */}
          {product.is_featured && (
            <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              مميز
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-all"
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>

          {/* Stock Status */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">غير متوفر</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.review_count})
              </span>
            </div>
          </div>

          {/* Price and Button */}
          <div className="space-y-3 mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-600">
                {product.price.toFixed(2)} ر.س
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isAdding}
              className="w-full bg-primary-500 text-white py-2 rounded-lg font-bold hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              أضف للسلة
            </button>
          </div>
        </div>

        {/* Add to Cart Notification */}
        {showNotification && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg text-green-600 font-bold">
              تمت الإضافة!
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
