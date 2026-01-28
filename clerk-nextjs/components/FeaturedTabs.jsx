"use client";
import React, { useState } from 'react';
import ProductCard from './ProductCard';

const FeaturedTabs = ({ products, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState('free-days');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'free-days':
        return products.filter(p => p.originalPrice); // Products with discount
      case 'new':
        return products.filter(p => p.isNew);
      case 'promo':
        return products.filter(p => p.originalPrice);
      case 'trending':
        return products.slice(0, 8); // Top products
      default:
        return products;
    }
  };

  const tabs = [
    { id: 'free-days', label: 'أيام التخفيضات' },
    { id: 'new', label: 'المنتجات الجديدة' },
    { id: 'promo', label: 'العروض' },
    { id: 'trending', label: 'المنتجات الرائجة' }
  ];

  return (
    <section className="featured-tabs">
      <div className="container">
        <h2 className="section-title">استمتعوا بعروضنا</h2>
        <ul className="nav nav-tabs">
          {tabs.map(tab => (
            <li key={tab.id} className="nav-item">
              <button
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          <div className="products-grid">
            {getFilteredProducts().map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTabs;