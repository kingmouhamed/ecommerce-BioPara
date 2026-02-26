"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  itemClassName?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  interval = 3000,
  showArrows = true,
  showDots = true,
  className = '',
  itemClassName = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalItems = React.Children.count(children);

  useEffect(() => {
    if (autoPlay && !isPaused && totalItems > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, isPaused, totalItems]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    if (autoPlay) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (autoPlay) setIsPaused(false);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div 
      className={cn('relative w-full overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div className="relative h-full">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className={cn('w-full flex-shrink-0', itemClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalItems > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Product Carousel Component
export const ProductCarousel: React.FC<{
  products: any[];
  autoPlay?: boolean;
  className?: string;
}> = ({ products, autoPlay = true, className }) => (
  <Carousel
    autoPlay={autoPlay}
    interval={4000}
    showArrows
    showDots
    className={cn('h-64 md:h-80', className)}
  >
    {products.map((product) => (
      <div key={product.id} className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="text-center p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
          <p className="text-emerald-600 font-bold text-lg mb-4">{product.price.toFixed(2)} د.م</p>
          <div className="flex items-center justify-center space-x-1 space-x-reverse mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                )}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>
      </div>
    ))}
  </Carousel>
);

// Hero Carousel Component
export const HeroCarousel: React.FC<{
  slides: Array<{
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    ctaLink: string;
  }>;
  autoPlay?: boolean;
  className?: string;
}> = ({ slides, autoPlay = true, className }) => (
  <Carousel
    autoPlay={autoPlay}
    interval={5000}
    showArrows
    showDots
    className={cn('h-96 md:h-[500px]', className)}
  >
    {slides.map((slide, index) => (
      <div key={index} className="relative h-full">
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
            <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
            <a
              href={slide.ctaLink}
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              {slide.cta}
            </a>
          </div>
        </div>
      </div>
    ))}
  </Carousel>
);

export default Carousel;
