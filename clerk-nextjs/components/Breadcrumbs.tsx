"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  className?: string;
  maxItems?: number;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator,
  showHome = true,
  homeHref = "/",
  className = "",
  maxItems = 5,
}) => {
  const defaultSeparator = <ChevronLeft className="h-4 w-4 text-gray-400" />;

  // إضافة الصفحة الرئيسية إذا لم تكن موجودة
  const fullItems = showHome && items[0]?.href !== homeHref
    ? [
        {
          label: "الرئيسية",
          href: homeHref,
          icon: <Home className="h-4 w-4" />,
        },
        ...items,
      ]
    : items;

  // تقليص العناصر إذا كانت أكثر من الحد الأقصى
  const displayItems = fullItems.length <= maxItems
    ? fullItems
    : [
        fullItems[0],
        {
          label: "...",
          href: undefined,
          icon: null,
        },
        ...fullItems.slice(-maxItems + 2),
      ];

  return (
    <nav
      className={`flex items-center space-x-reverse space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
      dir="rtl"
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.label === "...";

        return (
          <React.Fragment key={index}>
            {index > 0 && !isEllipsis && (
              <span className="text-gray-400">
                {separator || defaultSeparator}
              </span>
            )}

            {isEllipsis ? (
              <span className="text-gray-500">{item.label}</span>
            ) : isLast ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                <span className="flex items-center">
                  {item.icon && <span className="ml-2">{item.icon}</span>}
                  {item.label}
                </span>
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center"
              >
                {item.icon && <span className="ml-2">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 flex items-center">
                {item.icon && <span className="ml-2">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// مكون مساعد لإنشاء مسارات التنقل تلقائياً
interface AutoBreadcrumbsProps {
  pathname: string;
  customLabels?: Record<string, string>;
  showHome?: boolean;
  className?: string;
}

export const AutoBreadcrumbs: React.FC<AutoBreadcrumbsProps> = ({
  pathname,
  customLabels = {},
  showHome = true,
  className = "",
}) => {
  // تحويل المسار إلى عناصر التنقل
  const pathSegments = pathname.split("/").filter(Boolean);
  
  const defaultLabels: Record<string, string> = {
    products: "المنتجات",
    cart: "السلة",
    checkout: "الدفع",
    contact: "اتصل بنا",
    about: "من نحن",
    brands: "العلامات التجارية",
    promotions: "العروض",
    favorites: "المفضلة",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    terms: "الشروط والأحكام",
    delivery: "التوصيل",
    category: "الفئات",
    "الأعشاب الطبية": "الأعشاب الطبية",
    "Parapharmacie": "شبه صيدلية",
    ...customLabels,
  };

  const items: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = defaultLabels[segment] || segment;
    
    return {
      label,
      href,
    };
  });

  return (
    <Breadcrumbs
      items={items}
      showHome={showHome}
      className={className}
    />
  );
};

// مكون للتنقل المنظم
interface StructuredBreadcrumbsProps {
  category?: string;
  subcategory?: string;
  product?: string;
  brand?: string;
  search?: string;
  className?: string;
}

export const StructuredBreadcrumbs: React.FC<StructuredBreadcrumbsProps> = ({
  category,
  subcategory,
  product,
  brand,
  search,
  className = "",
}) => {
  const items: BreadcrumbItem[] = [];

  if (category) {
    items.push({
      label: category,
      href: `/category/${encodeURIComponent(category)}`,
    });
  }

  if (subcategory && category) {
    items.push({
      label: subcategory,
      href: `/category/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`,
    });
  }

  if (brand) {
    items.push({
      label: brand,
      href: `/brands/${encodeURIComponent(brand)}`,
    });
  }

  if (search) {
    items.push({
      label: `نتائج البحث: "${search}"`,
      href: `/products?search=${encodeURIComponent(search)}`,
    });
  }

  if (product) {
    items.push({
      label: product,
      // لا يوجد رابط لصفحة المنتج الحالية
    });
  }

  return (
    <Breadcrumbs
      items={items}
      className={className}
    />
  );
};

// مكون للتنقل في صفحات المنتجات
interface ProductBreadcrumbsProps {
  categoryName?: string;
  productName?: string;
  searchQuery?: string;
  className?: string;
}

export const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({
  categoryName,
  productName,
  searchQuery,
  className = "",
}) => {
  const items: BreadcrumbItem[] = [];

  if (categoryName) {
    items.push({
      label: categoryName,
      href: `/products?category=${encodeURIComponent(categoryName)}`,
    });
  }

  if (searchQuery) {
    items.push({
      label: `بحث: ${searchQuery}`,
      href: `/products?search=${encodeURIComponent(searchQuery)}`,
    });
  }

  if (productName) {
    items.push({
      label: productName,
      // المنتج الحالي - لا يوجد رابط
    });
  }

  return (
    <Breadcrumbs
      items={items}
      className={className}
    />
  );
};

export default Breadcrumbs;
