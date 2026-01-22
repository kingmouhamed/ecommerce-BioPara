import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <Link to={`/products/${product.id}`} className="block">
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
          <Link to={`/products/${product.id}`}>
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
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <ShoppingCart size={16} className="mr-2" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

