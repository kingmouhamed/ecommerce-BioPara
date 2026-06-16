"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const PLACEHOLDER = "/images/products/product-placeholder.jpg";

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const displayImages = images && images.length > 0 ? images : [PLACEHOLDER];
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnails = displayImages.slice(0, 4);
  const mainSrc = displayImages[activeIndex] ?? PLACEHOLDER;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-50" style={{ height: "400px" }}>
        <Image
          src={mainSrc}
          alt={productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
      </div>

      {/* Thumbnails */}
      {thumbnails.length > 1 && (
        <div className="flex flex-row gap-3">
          {thumbnails.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E] focus-visible:ring-offset-2 ${
                idx === activeIndex
                  ? "border-[#C8963E] shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`${productName} - صورة ${idx + 1}`}
              aria-current={idx === activeIndex ? "true" : undefined}
            >
              <Image
                src={src}
                alt={`${productName} - ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
