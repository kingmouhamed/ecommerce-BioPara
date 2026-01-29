"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { products } from '../../products';
import { useCart } from '../../contexts/CartContext';

export default function FavoritesPage() {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<number[]>([]);

  // In a real app, this would come from localStorage or a backend
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

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      {favoriteProducts.length === 0 ? (
        <p className="text-gray-600">No favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
