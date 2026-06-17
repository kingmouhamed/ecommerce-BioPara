'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Heart, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import ProductImage from '@/components/ui/ProductImage';
import { Product } from '@/lib/data/products';

export default function EnhancedProductCard({ product }: { product: Product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page
    if (isOutOfStock) return;

    addToCart({
      id: product.id.toString(),
      title: product.name,
      price: product.price,
      slug: product.slug,
      image: product.images?.[0] || '/images/products/product-placeholder.jpg',
    });
    setIsCartOpen(true);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    // Here you would trigger a Zustand state or Context to open a global QuickView Modal
    console.log("Open Quick View for:", product.name);
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
    >
      {/* Dynamic Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {isOutOfStock && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            نفذت الكمية
          </span>
        )}
        {hasDiscount && !isOutOfStock && (
          <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            خصم {discountPercentage}%
          </span>
        )}
        {product.featured && !isOutOfStock && (
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm relative overflow-hidden group-hover:animate-pulse">
            مميز
          </span>
        )}
      </div>

      {/* Quick Action Overlay (Visible on Hover) */}
      <div
        className={`absolute top-4 left-4 z-10 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}
      >
        <button
          onClick={handleQuickView}
          className="w-10 h-10 bg-white/90 backdrop-blur text-gray-700 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white shadow-md transition-colors"
          title="نظرة سريعة"
        >
          <Eye className="w-5 h-5" />
        </button>
        <button
          className="w-10 h-10 bg-white/90 backdrop-blur text-gray-700 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white shadow-md transition-colors"
          title="إضافة للمفضلة"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Product Image Area */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <ProductImage
          src={product.images?.[0] || '/images/products/product-placeholder.jpg'}
          alt={product.name}
          className={`transition-opacity duration-500 ${isHovered && product.images?.[1] ? 'opacity-0' : 'opacity-100'}`}
        />
        {product.images?.[1] && (
          <ProductImage
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`} className="block group-hover:text-emerald-600 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-emerald-600">
              {product.price.toFixed(2)} د.م
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {product.original_price?.toFixed(2)} د.م
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdded}
            className={`
               w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm
               ${isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-emerald-200 hover:-translate-y-1'
              }
             `}
            title={isOutOfStock ? 'نفذت الكمية' : 'إضافة للسلة'}
          >
            {isAdded ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
