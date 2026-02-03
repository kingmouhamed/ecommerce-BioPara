"use client";
import React from 'react';
import ProductCard from './ProductCard';
import { ChevronDown } from 'lucide-react';

const ProductList = ({
  products,
  onAddToCart,
  sortBy,
  setSortBy,
  visibleProducts,
  loadMore
}) => {
  return (
    <main style={{ padding: '20px 5%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              appearance: 'none',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '8px 30px 8px 12px',
              cursor: 'pointer'
            }}
          >
            <option value="default">ترتيب حسب: مقترحاتنا</option>
            <option value="rating_desc">الأعلى تقييمًا</option>
            <option value="price_asc">الأقل سعرًا</option>
            <option value="price_desc">الأعلى سعرًا</option>
          </select>
          <ChevronDown size={18} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, visibleProducts).map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      {visibleProducts < products.length && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={loadMore}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 30px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            تحميل المزيد
          </button>
        </div>
      )}
    </main>
  );
};

export default ProductList;
