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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

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

  // التأكد من أن المصفوفة ليست فارغة قبل فحص العناصر
  const hasFirstEllipsis = visiblePages.length > 0 && visiblePages[0] > 2;
  const hasLastEllipsis = visiblePages.length > 0 && visiblePages[visiblePages.length - 1] < totalPages - 1;

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
      title={`صفحة ${page}`}
      aria-label={`صفحة ${page}`}
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
      aria-hidden="true"
    >
      <MoreHorizontal size={16} />
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
      {showFirstLast && (
        <button
          onClick={() => handlePageClick(1)}
          disabled={disabled || currentPage === 1}
          aria-label="انتقل للصفحة الأولى"
          title="الصفحة الأولى"
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

      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          aria-label="الصفحة السابقة"
          title="الصفحة السابقة"
          className={`
            p-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentPage === 1 || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
            }
          `}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {hasFirstEllipsis && renderEllipsis("first-ellipsis")}

      {visiblePages.map((page) => renderPageButton(page, page === currentPage))}

      {hasLastEllipsis && renderEllipsis("last-ellipsis")}

      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          aria-label="الصفحة التالية"
          title="الصفحة التالية"
          className={`
            p-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentPage === totalPages || disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
            }
          `}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {showFirstLast && (
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={disabled || currentPage === totalPages}
          aria-label="انتقل للصفحة الأخيرة"
          title="الصفحة الأخيرة"
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

// استخدام Omit لحذف totalPages من الخصائص المطلوبة
interface FullPaginationProps extends Omit<PaginationProps, 'totalPages'> {
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

  React.useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputPage(String(currentPage));
    }
  };

  // تم تصحيح نوع الحدث هنا: React.ChangeEvent<HTMLInputElement>
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center space-x-reverse space-x-2 ${className}`} dir="rtl">
      <label htmlFor="quick-nav-input" className="text-sm text-gray-600">اذهب إلى صفحة:</label>
      <input
        id="quick-nav-input"
        type="number"
        min={1}
        max={totalPages}
        value={inputPage}
        onChange={handleInputChange}
        placeholder="رقم الصفحة"
        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <button
        type="submit"
        aria-label="تأكيد الذهاب للصفحة"
        title="تأكيد"
        className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
      >
        اذهب
      </button>
    </form>
  );
};

export default Pagination;