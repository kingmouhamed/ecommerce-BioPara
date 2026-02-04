"use client";

import React from "react";
import { Loader2, ShoppingCart, Heart, Eye, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// أنواع الأزرار
export type ButtonVariant = 
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive"
  | "success"
  | "warning";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // خريطة الأنماط حسب النوع
    const variantClasses = {
      primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-emerald-500",
      ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
      link: "text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline focus:ring-emerald-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm",
    };

    // خريطة الأنماط حسب الحجم
    const sizeClasses = {
      xs: "px-2 py-1 text-xs font-medium rounded",
      sm: "px-3 py-1.5 text-sm font-medium rounded-md",
      md: "px-4 py-2 text-sm font-medium rounded-md",
      lg: "px-6 py-3 text-base font-medium rounded-lg",
      xl: "px-8 py-4 text-lg font-medium rounded-lg",
    };

    // خريطة الأنماط للأيقونات حسب الحجم
    const iconSizeClasses = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    };

    const baseClasses = cn(
      "inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className
    );

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className={cn("animate-spin", iconSizeClasses[size])} />;
      }
      if (icon) {
        return <span className={iconSizeClasses[size]}>{icon}</span>;
      }
      return null;
    };

    return (
      <button
        className={baseClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {iconPosition === "left" && renderIcon()}
        {children}
        {iconPosition === "right" && renderIcon()}
      </button>
    );
  }
);

Button.displayName = "Button";

// أزرار متخصصة
export const AddToCartButton: React.FC<
  Omit<ButtonProps, "icon" | "children"> & { inCart?: boolean }
> = ({ inCart = false, ...props }) => (
  <Button
    variant={inCart ? "secondary" : "primary"}
    icon={inCart ? <Minus /> : <Plus />}
    {...props}
  >
    {inCart ? "إزالة من السلة" : "أضف للسلة"}
  </Button>
);

export const BuyNowButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="primary"
    icon={<ShoppingCart />}
    iconPosition="right"
    {...props}
  >
    اشتر الآن
  </Button>
);

export const WishlistButton: React.FC<
  Omit<ButtonProps, "icon" | "children"> & { isWishlisted?: boolean }
> = ({ isWishlisted = false, ...props }) => (
  <Button
    variant="ghost"
    size="sm"
    icon={<Heart className={isWishlisted ? "fill-red-500 text-red-500" : ""} />}
    {...props}
  >
    {isWishlisted ? "في المفضلة" : "أضف للمفضلة"}
  </Button>
);

export const QuickViewButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="outline"
    size="sm"
    icon={<Eye />}
    {...props}
  >
    عرض سريع
  </Button>
);

export const CompareButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="ghost"
    size="sm"
    {...props}
  >
    مقارنة
  </Button>
);

// أزرار الإجراءات
export const ActionButtonsGroup: React.FC<{
  onAddToCart: () => void;
  onBuyNow: () => void;
  onWishlist: () => void;
  onQuickView: () => void;
  inCart?: boolean;
  isWishlisted?: boolean;
  loading?: boolean;
}> = ({
  onAddToCart,
  onBuyNow,
  onWishlist,
  onQuickView,
  inCart = false,
  isWishlisted = false,
  loading = false,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-3">
      <AddToCartButton
        inCart={inCart}
        onClick={onAddToCart}
        loading={loading}
        fullWidth
      />
      <BuyNowButton onClick={onBuyNow} />
    </div>
    <div className="flex gap-3">
      <WishlistButton
        isWishlisted={isWishlisted}
        onClick={onWishlist}
        fullWidth
      />
      <QuickViewButton onClick={onQuickView} fullWidth />
    </div>
  </div>
);

// أزرار التصفح
export const LoadMoreButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="outline"
    size="lg"
    fullWidth
    {...props}
  >
    عرض المزيد
  </Button>
);

export const BackToTopButton: React.FC<
  ButtonProps & { show: boolean }
> = ({ show, ...props }) => (
  <Button
    variant="secondary"
    size="sm"
    className={cn(
      "fixed bottom-8 left-8 z-50 transition-all duration-300",
      show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
    )}
    {...props}
  >
    ↑
  </Button>
);

// أزرار الفلاتر
export const FilterButton: React.FC<
  ButtonProps & { active?: boolean }
> = ({ active = false, ...props }) => (
  <Button
    variant={active ? "primary" : "outline"}
    size="sm"
    {...props}
  />
);

export const ClearFiltersButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="ghost"
    size="sm"
    {...props}
  >
    مسح الفلاتر
  </Button>
);

// أزرار النماذج
export const SubmitButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="primary"
    type="submit"
    {...props}
  />
);

export const CancelButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="outline"
    type="button"
    {...props}
  >
    إلغاء
  </Button>
);

export const ResetButton: React.FC<ButtonProps> = (props) => (
  <Button
    variant="ghost"
    type="reset"
    {...props}
  >
    إعادة تعيين
  </Button>
);

export default Button;
