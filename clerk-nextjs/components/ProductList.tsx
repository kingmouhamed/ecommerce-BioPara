"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "../data/products";

interface ProductListProps {
  title: string;
  subtitle?: string;
  products: Product[];
  addToCart: (product: Product) => void;
  viewAllLink?: string;
  type?: "para" | "herbal";
}

const ProductCard = ({ product, addToCart }: { product: Product; addToCart: (product: Product) => void }) => (
  <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition group relative flex flex-col h-full" dir="rtl">
    {/* Badge نوع المنتج */}
    <span key={`type-${product.id}`} className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded text-white z-10 ${product.type === 'herbal' ? 'bg-green-600' : 'bg-blue-600'}`}>
        {product.type === 'herbal' ? 'طبيعي / عضوي' : 'شبه صيدلية'}
    </span>

    {product.oldPrice && (
      <span key={`discount-${product.id}`} className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
      </span>
    )}
    <div className="relative mb-4 overflow-hidden h-48 flex items-center justify-center">
      <Image src={product.image} alt={product.title} width={192} height={192} className="h-full object-contain group-hover:scale-105 transition duration-300" />
      <button
        key={`button-${product.id}`}
        onClick={() => addToCart(product)}
        className="absolute bottom-0 w-full bg-emerald-700 text-white py-2 translate-y-full group-hover:translate-y-0 transition duration-300 font-medium"
      >
        أضف إلى السلة
      </button>
    </div>

    <div key={`category-${product.id}`} className="text-xs text-gray-500 mb-1 uppercase tracking-wide text-right">{product.category}</div>
    <h3 key={`title-${product.id}`} className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[40px] text-right" title={product.title}>
      {product.title}
    </h3>

    <div className="flex items-end gap-2 mt-auto justify-end">
      <span key={`price-${product.id}`} className="text-lg font-bold text-emerald-700">{product.price.toFixed(2)} د.م</span>
      {product.oldPrice && <span key={`old-price-${product.id}`} className="text-sm text-gray-400 line-through mb-1">{product.oldPrice.toFixed(2)} د.م</span>}
    </div>
  </div>
);

const ProductList = ({ title, subtitle, products, addToCart, viewAllLink, type }: ProductListProps) => {
  return (
    <section className="container mx-auto px-4 py-12" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold text-gray-800 ${type === 'herbal' ? 'border-r-4 border-green-600' : 'border-r-4 border-emerald-600'} pr-3`}>
            {title}
          </h2>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link href={viewAllLink} className={`${type === 'herbal' ? 'text-green-700' : 'text-emerald-700'} text-sm font-medium hover:underline`}>
            عرض الكل
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
