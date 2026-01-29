"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { products } from '../../products';
import { useCart } from '../../contexts/CartContext';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites) && parsedFavorites.every(id => typeof id === 'number')) {
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite function
  const toggleFavorite = (productId: number) => {
    setFavorites(prevFavorites =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter(id => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      {favoriteProducts.length === 0 ? (
        <p className="text-gray-600">No favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map(product => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Remove from favorites"
              >
                <Heart size={20} className="text-red-500 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
