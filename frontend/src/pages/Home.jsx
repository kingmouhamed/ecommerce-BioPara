import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import CategoriesGrid from '../components/CategoriesGrid';
import Categories from '../components/Categories';
import FeaturedTabs from '../components/FeaturedTabs';
import Brands from '../components/Brands';
import Loyalty from '../components/Loyalty';
import ProductList from '../components/ProductList';

const Home = ({ products, addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(10);

  const sortedProducts = useMemo(() => {
    let sortableProducts = Array.isArray(products) ? [...products] : [];
    if (activeCategory !== 'Tous') {
      sortableProducts = sortableProducts.filter((product) => product.category === activeCategory);
    }
    switch (sortBy) {
      case 'price_asc':
        sortableProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price_desc':
        sortableProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating_desc':
        sortableProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sortableProducts;
  }, [sortBy, activeCategory, products]);

  return (
    <>
      <Hero />
      <CategoriesGrid />
      <Categories activeCategory={activeCategory} onCategoryClick={setActiveCategory} />
      <FeaturedTabs products={products} onAddToCart={addToCart} />
      <div style={{ padding: '0 5%' }}>
        <ProductList
          products={sortedProducts}
          onAddToCart={addToCart}
          sortBy={sortBy}
          setSortBy={setSortBy}
          visibleProducts={visibleProducts}
          loadMore={() => setVisibleProducts((prev) => prev + 10)}
        />
      </div>
      <Brands />
      <Loyalty />
    </>
  );
};

export default Home;
