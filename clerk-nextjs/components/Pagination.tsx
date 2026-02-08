"use client";

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPages = 5
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfShow = Math.floor(showPages / 2);
    
    let start = Math.max(1, currentPage - halfShow);
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2" dir="rtl">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
        }`}
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* First Page */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-gray-400">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-emerald-600 text-white font-semibold'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
        }`}
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
