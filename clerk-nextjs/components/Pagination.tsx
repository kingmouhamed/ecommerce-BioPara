"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = "",
  disabled = false,
}) => {
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // عرض كل الصفحات إذا كان العدد الإجمالي صغيراً
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // عرض نطاق من الصفحات حول الصفحة الحالية
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      // تعديل البداية إذا كان النطاق قصيراً في النهاية
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const hasFirstEllipsis = visiblePages[0] > 2;
  const hasLastEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageButton = (page: number, isCurrent: boolean = false) => (
    <button
      key={page}
      onClick={() => handlePageClick(page)}
      disabled={disabled || isCurrent}
      className={`
        px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
        ${isCurrent
          ? "bg-emerald-600 text-white shadow-md"
          : disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
        }
      `}
    >
      {page}
    </button>
  );

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="px-3 py-2 text-gray-500"
    >
      <MoreHorizontal className="h-4 w-4" />
    </span>
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex items-center justify-center space-x-reverse space-x-1 ${className}`}
      aria-label="Pagination"
      dir="rtl"
    >
      {/* زر الصفحة الأولى */}
      {showFirstLast && (
        <button
          onClick={() => handlePageClick(1)}
          disabled={disabled || currentPage === 1}
          className={`
            px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentPage === 1 || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
            }
          `}
        >
          الأولى
        </button>
      )}

      {/* زر السابق */}
      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className={`
            p-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentPage === 1 || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
            }
          `}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* علامة الحذف الأول */}
      {hasFirstEllipsis && renderEllipsis("first-ellipsis")}

      {/* أرقام الصفحات */}
      {visiblePages.map((page) => renderPageButton(page, page === currentPage))}

      {/* علامة الحذف الأخير */}
      {hasLastEllipsis && renderEllipsis("last-ellipsis")}

      {/* زر التالي */}
      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className={`
            p-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentPage === totalPages || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
            }
          `}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* زر الصفحة الأخيرة */}
      {showFirstLast && (
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={disabled || currentPage === totalPages}
          className={`
            px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentPage === totalPages || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
            }
          `}
        >
          الأخيرة
        </button>
      )}
    </nav>
  );
};

// مكون مساعد لعرض معلومات الصفحة
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  className = "",
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-sm text-gray-600 ${className}`} dir="rtl">
      <span>
        عرض {startItem}-{endItem} من أصل {totalItems} عنصر
      </span>
      <span className="mr-4">
        الصفحة {currentPage} من {totalPages}
      </span>
    </div>
  );
};

// مكون شامل للصفحة مع معلومات
interface FullPaginationProps extends PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  showInfo?: boolean;
  infoPosition?: "top" | "bottom" | "both";
  infoClassName?: string;
}

export const FullPagination: React.FC<FullPaginationProps> = ({
  itemsPerPage,
  totalItems,
  showInfo = true,
  infoPosition = "bottom",
  infoClassName = "",
  ...paginationProps
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderInfo = () => (
    <PaginationInfo
      currentPage={paginationProps.currentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      className={infoClassName}
    />
  );

  return (
    <div className="space-y-4">
      {(infoPosition === "top" || infoPosition === "both") && showInfo && renderInfo()}
      
      <Pagination
        {...paginationProps}
        totalPages={totalPages}
      />
      
      {(infoPosition === "bottom" || infoPosition === "both") && showInfo && renderInfo()}
    </div>
  );
};

// مكون للتنقل السريع
interface QuickNavProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const QuickNav: React.FC<QuickNavProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const [inputPage, setInputPage] = React.useState(String(currentPage));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputPage(String(currentPage));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center space-x-reverse space-x-2 ${className}`} dir="rtl">
      <span className="text-sm text-gray-600">اذهب إلى صفحة:</span>
      <input
        type="number"
        min={1}
        max={totalPages}
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <button
        type="submit"
        className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
      >
        اذهب
      </button>
    </form>
  );
};

export default Pagination;
