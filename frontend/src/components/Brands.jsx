import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Brands = () => {
  const brandLogos = [
    'La Roche-Posay',
    'Vichy',
    'CeraVe',
    'Nuxe',
    'SVR',
    'Uriage',
    'Avène',
    'Bioderma',
    'Eucerin',
    'Mustela'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerView >= brandLogos.length ? 0 : prevIndex + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerView < 0 ? Math.max(0, brandLogos.length - itemsPerView) : prevIndex - itemsPerView
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (brandLogos.length - itemsPerView + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [brandLogos.length]);

  const visibleBrands = brandLogos.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="brands-section">
      <div className="container">
        <h2 className="section-title">ماركاتنا الشريكة</h2>
        <div className="brands-carousel">
          <button className="carousel-control prev" onClick={prevSlide}>
            <ChevronLeft />
          </button>
          <div className="brands-grid">
            {visibleBrands.map((brand, index) => (
              <div key={index} className="brand-logo">
                {brand}
              </div>
            ))}
          </div>
          <button className="carousel-control next" onClick={nextSlide}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Brands;
