"use client";

import React from 'react';
import { products } from '../../../products';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import Image from 'next/image';

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(params.id, 10));

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  const renderStars = (rating: number) => {
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
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Retour
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={`/${product.image.replace(/^\/?public\//, '')}`}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto object-contain rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-2">Catégorie: {product.category}</p>
          <div className="flex items-center mb-4">
            {renderStars(product.rating)}
            <span className="ml-2 text-sm text-gray-500">({product.reviews || 0} avis)</span>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-green-700">{product.price} DH</span>
            {product.originalPrice && (
              <span className="ml-4 text-gray-500 line-through">{product.originalPrice} DH</span>
            )}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => addToCart(product)}
              className="w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <ShoppingCart size={16} className="mr-2" />
              Ajouter au panier
            </button>
            <button
              onClick={() => {
                const productUrl = window.location.href;
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
      </div>
    </div>
  );
};

export default ProductDetailsPage;
