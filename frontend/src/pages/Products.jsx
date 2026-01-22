import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Slider, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import ProductList from '../components/ProductList';
import Categories from '../components/Categories';

const ProductsPage = ({ products, addToCart }) => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [activeCategory, setActiveCategory] = useState(() => {
    return searchParams.get('category') || 'Tous';
  });
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (activeCategory !== 'Tous') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price.replace(' DH', ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }
    return filtered;
  }, [products, activeCategory, priceRange, ratingFilter]);

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...filteredProducts];
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
  }, [filteredProducts, sortBy]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <div>
      <Categories activeCategory={activeCategory} onCategoryClick={setActiveCategory} />
      <div style={{ padding: '2rem 5%' }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ minWidth: 200 }}>
            <Typography gutterBottom>نطاق السعر (DH)</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
          </Box>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>التقييم الأدنى</InputLabel>
            <Select
              value={ratingFilter}
              label="التقييم الأدنى"
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <MenuItem value={0}>الكل</MenuItem>
              <MenuItem value={1}>1+</MenuItem>
              <MenuItem value={2}>2+</MenuItem>
              <MenuItem value={3}>3+</MenuItem>
              <MenuItem value={4}>4+</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ProductList
          products={sortedProducts}
          onAddToCart={addToCart}
          sortBy={sortBy}
          setSortBy={setSortBy}
          visibleProducts={visibleProducts}
          loadMore={() => setVisibleProducts(prev => prev + 10)}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
