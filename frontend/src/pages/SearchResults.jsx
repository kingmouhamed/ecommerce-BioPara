import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const SearchResults = ({ products, addToCart }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }, [query, products]);

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft /> عودة
        </button>
        <h1>
          <Search size={32} />
          نتائج البحث عن: <span className="query-text">&quot;{query}&quot;</span>
        </h1>
      </div>

      <div className="search-results-container">
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <Search size={64} />
            <h2>لم يتم العثور على نتائج</h2>
            <p>لا توجد منتجات تطابق البحث عن &quot;{query}&quot;</p>
            <div className="search-suggestions">
              <h3>اقتراحات:</h3>
              <ul>
                <li>تأكد من صحة كتابة البحث</li>
                <li>حاول استخدام كلمات أخرى</li>
                <li>ابحث عن فئة عامة أكثر</li>
              </ul>
            </div>
            <button className="browse-btn" onClick={() => navigate('/products')}>
              استعرض جميع المنتجات
            </button>
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>تم العثور على <strong>{filteredProducts.length}</strong> منتج</p>
            </div>
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
