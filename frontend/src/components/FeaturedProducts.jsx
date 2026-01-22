import React from 'react';
import ProductCard from './ProductCard';

const FeaturedProducts = ({ products, onAddToCart }) => {
  const featured = products.slice(0, 4); // أول 4 منتجات كمثال

  return (
    <div className="featured-section">
      <h2 className="section-title">Profitez Bien JOURNÉES DES GRATUITS</h2>
      <div className="featured-grid">
        {featured.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
      <div className="view-all">
        <button>TOUS LES PRODUITS</button>
      </div>
    </div>
  );
};

export default FeaturedProducts;