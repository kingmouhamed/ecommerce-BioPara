"use client";

import React from 'react';
import { products } from '../../../products';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(params.id, 10));

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

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
          <img
            src={`/${product.image.replace(/^\/?public\//, '')}`}
            alt={product.name}
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
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-green-700">{product.price} DH</span>
            {product.originalPrice && (
              <span className="ml-4 text-gray-500 line-through">{product.originalPrice} DH</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <ShoppingCart size={16} className="mr-2" />
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
