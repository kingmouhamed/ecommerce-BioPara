"use client";

import React from "react";
import { X, Check, AlertCircle, Info, Star, TrendingUp, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeVariant = 
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "outline";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
  count?: number;
  maxCount?: number;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      children,
      icon,
      removable = false,
      onRemove,
      dot = false,
      count,
      maxCount = 99,
      ...props
    },
    ref
  ) => {
    // خريطة الأنماط حسب النوع
    const variantClasses = {
      default: "bg-gray-100 text-gray-800 border-gray-200",
      primary: "bg-emerald-100 text-emerald-800 border-emerald-200",
      secondary: "bg-blue-100 text-blue-800 border-blue-200",
      success: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      error: "bg-red-100 text-red-800 border-red-200",
      info: "bg-purple-100 text-purple-800 border-purple-200",
      outline: "border border-gray-300 text-gray-700 bg-white",
    };

    // خريطة الأنماط حسب الحجم
    const sizeClasses = {
      xs: "px-1.5 py-0.5 text-xs font-medium",
      sm: "px-2 py-1 text-xs font-medium",
      md: "px-2.5 py-1.5 text-sm font-medium",
      lg: "px-3 py-2 text-sm font-medium",
    };

    // خريطة أحجام الأيقونات
    const iconSizeClasses = {
      xs: "h-3 w-3",
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-4 w-4",
    };

    const baseClasses = cn(
      "inline-flex items-center gap-1 rounded-full border transition-all duration-200",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    const renderCount = () => {
      if (count !== undefined) {
        const displayCount = count > maxCount ? `${maxCount}+` : count;
        return <span>{displayCount}</span>;
      }
      return null;
    };

    const renderContent = () => {
      if (dot) {
        return (
          <span className={cn(
            "inline-block rounded-full",
            size === "xs" ? "h-2 w-2" : size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3",
            variantClasses[variant].replace(/text-\w+-\d+/, "").replace(/border-\w+-\d+/, "")
          )} />
        );
      }

      if (count !== undefined) {
        return renderCount();
      }

      return children;
    };

    return (
      <span className={baseClasses} ref={ref} {...props}>
        {icon && <span className={iconSizeClasses[size]}>{icon}</span>}
        {renderContent()}
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="إزالة"
            className={cn(
              "mr-1 rounded-full hover:bg-black/10 transition-colors",
              iconSizeClasses[size]
            )}
          >
            <X className="h-full w-full" />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// شارات متخصصة
export const StatusBadge: React.FC<
  Omit<BadgeProps, "variant"> & { status: "active" | "inactive" | "pending" | "archived" }
> = ({ status, ...props }) => {
  const statusMap = {
    active: { variant: "success" as BadgeVariant, label: "نشط" },
    inactive: { variant: "default" as BadgeVariant, label: "غير نشط" },
    pending: { variant: "warning" as BadgeVariant, label: "قيد الانتظار" },
    archived: { variant: "outline" as BadgeVariant, label: "مؤرشف" },
  };

  const { variant, label } = statusMap[status];

  return (
    <Badge variant={variant} {...props}>
      {label}
    </Badge>
  );
};

export const StockBadge: React.FC<
  Omit<BadgeProps, "variant"> & { stock: number; maxStock?: number }
> = ({ stock, maxStock = 10, ...props }) => {
  const getVariant = (): BadgeVariant => {
    if (stock === 0) return "error";
    if (stock <= 3) return "warning";
    if (stock <= maxStock) return "info";
    return "success";
  };

  const getLabel = () => {
    if (stock === 0) return "نفد المخزون";
    if (stock <= 3) return `متبقي ${stock} فقط`;
    return "متوفر";
  };

  return (
    <Badge variant={getVariant()} {...props}>
      {getLabel()}
    </Badge>
  );
};

export const RatingBadge: React.FC<{
  rating: number;
  maxRating?: number;
  showCount?: boolean;
  reviewCount?: number;
  size?: BadgeSize;
}> = ({ rating, maxRating = 5, showCount = false, reviewCount, size = "sm" }) => {
  const stars = Math.round(rating);
  const filledStars = Array(stars).fill(0);
  const emptyStars = Array(maxRating - stars).fill(0);

  return (
    <Badge variant="outline" size={size} icon={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}>
      <div className="flex items-center gap-1">
        <span>{rating.toFixed(1)}</span>
        {showCount && reviewCount && (
          <span className="text-gray-500">({reviewCount})</span>
        )}
      </div>
    </Badge>
  );
};

export const PriceBadge: React.FC<{
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  size?: BadgeSize;
}> = ({ price, originalPrice, discount, currency = "د.م", size = "sm" }) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = discount || (hasDiscount ? Math.round(((originalPrice! - price) / originalPrice!) * 100) : 0);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="primary" size={size}>
        {price} {currency}
      </Badge>
      {hasDiscount && (
        <>
          <Badge variant="outline" size={size} className="line-through text-gray-500">
            {originalPrice} {currency}
          </Badge>
          <Badge variant="error" size={size}>
            -{discountPercentage}%
          </Badge>
        </>
      )}
    </div>
  );
};

export const CategoryBadge: React.FC<{
  category: string;
  color?: string;
  size?: BadgeSize;
}> = ({ category, color, size = "sm" }) => {
  const categoryColors: Record<string, string> = {
    "الأعشاب الطبية": "success",
    "Parapharmacie": "primary",
    "مستحضرات التجميل": "secondary",
    "منتجات عضوية": "info",
  };

  const variant = (color || categoryColors[category]) as BadgeVariant;

  return (
    <Badge variant={variant} size={size}>
      {category}
    </Badge>
  );
};

export const NewBadge: React.FC<{ size?: BadgeSize }> = ({ size = "sm" }) => (
  <Badge variant="error" size={size}>
    جديد
  </Badge>
);

export const SaleBadge: React.FC<{ 
  discount?: number; 
  size?: BadgeSize;
}> = ({ discount, size = "sm" }) => (
  <Badge variant="warning" size={size} icon={<Tag className="h-3 w-3" />}>
    {discount ? `خصم ${discount}%` : "عروض"}
  </Badge>
);

export const TrendingBadge: React.FC<{ size?: BadgeSize }> = ({ size = "sm" }) => (
  <Badge variant="primary" size={size} icon={<TrendingUp className="h-3 w-3" />}>
    رائج
  </Badge>
);

export const LimitedBadge: React.FC<{ size?: BadgeSize }> = ({ size = "sm" }) => (
  <Badge variant="warning" size={size} icon={<Clock className="h-3 w-3" />}>
    محدود
  </Badge>
);

export const FeaturedBadge: React.FC<{ size?: BadgeSize }> = ({ size = "sm" }) => (
  <Badge variant="secondary" size={size} icon={<Star className="h-3 w-3" />}>
    مميز
  </Badge>
);

// شارات الإشعارات
export const NotificationBadge: React.FC<{
  count: number;
  maxCount?: number;
  showZero?: boolean;
  size?: BadgeSize;
}> = ({ count, maxCount = 99, showZero = false, size = "sm" }) => {
  if (!showZero && count === 0) return null;

  return (
    <Badge 
      variant="error" 
      size={size === "xs" ? "xs" : "sm"} 
      count={count} 
      maxCount={maxCount}
      className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center p-0"
    />
  );
};

// شارات الفلاتر
export const FilterBadge: React.FC<{
  label: string;
  active?: boolean;
  onRemove?: () => void;
  removable?: boolean;
}> = ({ label, active = false, onRemove, removable = true }) => (
  <Badge
    variant={active ? "primary" : "outline"}
    removable={removable}
    onRemove={onRemove}
  >
    {label}
  </Badge>
);

// شارات المنتجات
export const ProductBadges: React.FC<{
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  isTrending?: boolean;
  isLimited?: boolean;
  isFeatured?: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}> = ({
  isNew,
  isSale,
  discount,
  isTrending,
  isLimited,
  isFeatured,
  stock,
  rating,
  reviewCount,
}) => (
  <div className="flex flex-wrap gap-2">
    {isNew && <NewBadge />}
    {isSale && <SaleBadge discount={discount} />}
    {isTrending && <TrendingBadge />}
    {isLimited && <LimitedBadge />}
    {isFeatured && <FeaturedBadge />}
    {stock !== undefined && <StockBadge stock={stock} />}
    {rating && <RatingBadge rating={rating} reviewCount={reviewCount} />}
  </div>
);

export default Badge;
