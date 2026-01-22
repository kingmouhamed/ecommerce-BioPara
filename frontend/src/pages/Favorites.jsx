import React, { useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Favorites = ({ addToCart }) => {
  const [favorites, setFavorites] = useState([]);

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
  };

  return (
    <div className="favorites-page">
      <section className="favorites-header">
        <h1><Heart size={32} /> منتجاتي المفضلة</h1>
        <p>جميع المنتجات التي أضفتها إلى المفضلة</p>
      </section>

      <div className="favorites-container">
        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <Heart size={64} />
            <h2>لا توجد منتجات مفضلة بعد</h2>
            <p>أضف منتجاتك المفضلة لتصلك عروض خاصة عليها</p>
          </div>
        ) : (
          <>
            <div className="favorites-info">
              <p>لديك {favorites.length} منتج مفضل</p>
            </div>
            <div className="favorites-list">
              {favorites.map(product => (
                <div key={product.id} className="favorite-item">
                  <div className="favorite-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="favorite-details">
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <div className="rating">
                      <span className="stars">★ {product.rating}</span>
                      <span className="reviews">({product.reviews} تقييم)</span>
                    </div>
                    <p className="price">{product.price}</p>
                  </div>
                  <div className="favorite-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={18} /> أضف للسلة
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;