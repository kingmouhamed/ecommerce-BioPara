"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", children }) => (
  <div
    className={`
      animate-pulse rounded-md bg-gray-200
      ${className}
    `}
  >
    {children}
  </div>
);

// هيكل عظمي لبطاقة المنتج
export const ProductCardSkeleton: React.FC<{
  showActions?: boolean;
  className?: string;
}> = ({ showActions = true, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {/* صورة المنتج */}
    <Skeleton className="w-full h-48" />
    
    {/* محتوى المنتج */}
    <div className="p-4 space-y-3">
      {/* اسم المنتج */}
      <Skeleton className="h-5 w-3/4" />
      
      {/* وصف قصير */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      
      {/* التقييم */}
      <div className="flex items-center space-x-reverse space-x-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      
      {/* السعر */}
      <div className="flex items-center space-x-reverse space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      
      {/* الأزرار */}
      {showActions && (
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      )}
    </div>
  </div>
);

// هيكل عظمي لقائمة المنتجات
export const ProductListSkeleton: React.FC<{
  count?: number;
  showActions?: boolean;
  gridCols?: number;
}> = ({ 
  count = 8, 
  showActions = true,
  gridCols = 4 
}) => {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  }[gridCols] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton
          key={index}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

// هيكل عظمي لصفحة المنتجات
export const ProductPageSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8" dir="rtl">
    {/* العنوان والوصف */}
    <div className="text-center mb-12 space-y-4">
      <Skeleton className="h-10 w-64 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
    </div>

    {/* الفلاتر والبحث */}
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-32" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>

    {/* قائمة المنتجات */}
    <ProductListSkeleton count={8} />
  </div>
);

// هيكل عظمي لتفاصيل المنتج
export const ProductDetailSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8" dir="rtl">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* صور المنتج */}
      <div className="space-y-4">
        <Skeleton className="w-full h-96 rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded" />
          ))}
        </div>
      </div>

      {/* معلومات المنتج */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        
        <div className="flex items-center space-x-reverse space-x-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex items-center space-x-reverse space-x-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>

        <div className="border-t pt-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// هيكل عظمي للسلة
export const CartSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8" dir="rtl">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* عناصر السلة */}
      <div className="lg:col-span-2 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ملخص السلة */}
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

// هيكل عظمي للفئات
export const CategorySkeleton: React.FC<{
  count?: number;
  gridCols?: number;
}> = ({ count = 6, gridCols = 3 }) => {
  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[gridCols] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Skeleton className="w-full h-32" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// هيكل عظمي للمراجعات
export const ReviewSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-reverse space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);

// هيكل عظمي عام
export const SkeletonLoader: React.FC<{
  type: "card" | "list" | "detail" | "cart" | "category" | "review";
  count?: number;
  gridCols?: number;
  showActions?: boolean;
}> = ({ type, count, gridCols, showActions }) => {
  switch (type) {
    case "card":
      return <ProductCardSkeleton showActions={showActions} />;
    case "list":
      return <ProductListSkeleton count={count} gridCols={gridCols} showActions={showActions} />;
    case "detail":
      return <ProductDetailSkeleton />;
    case "cart":
      return <CartSkeleton />;
    case "category":
      return <CategorySkeleton count={count} gridCols={gridCols} />;
    case "review":
      return <ReviewSkeleton count={count} />;
    default:
      return <ProductCardSkeleton />;
  }
};

export default ProductCardSkeleton;
