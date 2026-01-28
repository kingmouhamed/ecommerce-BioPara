"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const slides = [
    {
      id: 1,
      image: '/hero7.png',
      title: 'استمتعوا بعروضنا',
      subtitle: 'أيام التخفيضات - اكتشفوا عروضنا الخاصة',
      buttonText: 'اكتشف الآن'
    },
    {
      id: 2,
      image: '/products1.png',
      title: 'منتجات جديدة',
      subtitle: 'اكتشفوا أحدث المنتجات في متجرنا',
      buttonText: 'تسوق الآن'
    },
    {
      id: 3,
      image: '/products6.png',
      title: 'عروض خاصة',
      subtitle: 'خصومات تصل إلى 50% على منتجات مختارة',
      buttonText: 'استفد من العروض'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(27, 67, 50, 0.8), rgba(45, 106, 79, 0.8)), url(${slide.image})`
            }}
          >
            <div className="carousel-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <button className="carousel-button">{slide.buttonText}</button>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control prev" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        <ChevronRight size={24} />
      </button>
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;