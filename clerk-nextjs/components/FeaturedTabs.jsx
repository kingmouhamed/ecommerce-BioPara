"use client";
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const FeaturedTabs = ({ products, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState('free-days');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'free-days':
        return products.filter(p => p.originalPrice).slice(0, 10); // Show up to 10 discounted products
      case 'new':
        return products.filter(p => p.isNew).slice(0, 10);
      case 'promo':
        return products.filter(p => p.originalPrice).slice(0, 10);
      case 'trending':
        return products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 10); // Sort by reviews for trending
      default:
        return products.slice(0, 10);
    }
  };

  const tabs = [
    { id: 'free-days', label: 'أيام التخفيضات' },
    { id: 'new', label: 'المنتجات الجديدة' },
    { id: 'promo', label: 'العروض' },
    { id: 'trending', label: 'المنتجات الرائجة' }
  ];

  const filteredProducts = getFilteredProducts();

  return (
    <section className="featured-tabs py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">استمتعوا بعروضنا</h2>
        <ul className="flex justify-center border-b border-gray-200 mb-8">
          {tabs.map(tab => (
            <li key={tab.id} className="-mb-px mr-1 last:mr-0">
              <button
                className={`inline-block py-2 px-4 font-semibold ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-700 text-green-700'
                    : 'text-gray-500 hover:text-green-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="!pb-10" // Add padding for navigation buttons if they overlap
          >
            {filteredProducts.map(product => (
              <SwiperSlide key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTabs;