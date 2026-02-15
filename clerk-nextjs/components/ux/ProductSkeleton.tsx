import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 h-4 w-1/2"></div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-96 rounded-lg mb-8"></div>
      <div className="bg-gray-200 h-8 w-3/4 mb-4"></div>
      <div className="bg-gray-200 h-6 w-1/4 mb-4"></div>
      <div className="bg-gray-200 h-4 w-full mb-2"></div>
      <div className="bg-gray-200 h-4 w-full mb-2"></div>
      <div className="bg-gray-200 h-4 w-2/3"></div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return <ProductPageSkeleton />;
}

export function CartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-24 rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-24 rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-24 rounded-lg"></div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-64 rounded-lg mb-8"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="animate-pulse mb-4">
      <div className="bg-gray-200 h-4 w-1/4 mb-2"></div>
      <div className="bg-gray-200 h-4 w-full mb-2"></div>
      <div className="bg-gray-200 h-4 w-3/4"></div>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-4 w-1/4 mb-4"></div>
      <div className="bg-gray-200 h-64 rounded-lg"></div>
    </div>
  );
}

export default ProductCardSkeleton;
