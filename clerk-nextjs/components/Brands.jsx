"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const brandLogos = [
  'La Roche-Posay', 'Vichy', 'CeraVe', 'Nuxe', 'SVR', 'Uriage',
  'Avène', 'Bioderma', 'Eucerin', 'Mustela', 'Filorga', 'Caudalie'
];

const Brands = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          أشهر الماركات العالمية
        </h2>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
          className="!pb-10"
        >
          {brandLogos.map((brand, index) => (
            <SwiperSlide key={index} className="h-full">
              <div className="flex items-center justify-center h-28 p-4 bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-300 hover:border-green-300 hover:bg-green-50">
                <span className="text-lg font-semibold text-gray-600 text-center">
                  {brand}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Brands;
