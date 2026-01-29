"use client";
import React from 'react';
import { ShoppingCart, Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const ProductCard = ({ product, onAddToCart }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image ? `/${product.image.replace(/^\/?public\//, '')}` : '/placeholder.png'}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>
      {(product.isNew || product.originalPrice) && (
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">Nouveau</span>}
          {product.originalPrice && <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-semibold text-black">Promo</span>}
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="flex-grow text-sm font-medium text-gray-700">
          <Link href={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            {renderStars(product.rating)}
            <span className="ml-2 text-xs text-gray-500">({product.reviews || 0} avis)</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-lg font-bold text-green-700">{product.price}</p>
          {product.originalPrice && (
            <p className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice} DH</p>
          )}
        </div>
      </div>
      <div className="p-4 pt-0 space-y-2">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <ShoppingCart size={16} className="mr-2" />
          Ajouter au panier
        </button>
        <button
          onClick={() => {
            const productUrl = window.location.origin + `/products/${product.id}`;
            const message = `سلام، بغيت نشري هاد المنتوج:\n📌 الاسم: ${product.name}\n💰 الثمن: ${product.price} DH\n🔗 الرابط: ${productUrl}\n🔢 الكمية: 1\nشكرا 🙏`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/212673020264?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="w-full flex items-center justify-center rounded-md border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <MessageCircle size={16} className="mr-2" />
          اشري دابا عبر واتساب
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

