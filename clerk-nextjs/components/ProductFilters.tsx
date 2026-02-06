"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
  type: "checkbox" | "radio" | "range";
}

interface ProductFiltersProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, optionId: string) => void;
  onClearFilters: () => void;
  onClearGroup: (groupId: string) => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  onClearGroup,
  className = "",
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(filters.map((group) => group.id))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getActiveCount = (groupId: string) => {
    return activeFilters[groupId]?.length || 0;
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    (filters) => filters.length > 0
  );

  const renderFilterContent = (group: FilterGroup) => {
    switch (group.type) {
      case "checkbox":
        return (
          <div className="space-y-2">
            {group.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={activeFilters[group.id]?.includes(option.id) || false}
                    onChange={() => onFilterChange(group.id, option.id)}
                    className="ml-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </div>
                {option.count && (
                  <span className="text-sm text-gray-500">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {group.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={group.id}
                    checked={activeFilters[group.id]?.[0] === option.id}
                    onChange={() => onFilterChange(group.id, option.id)}
                    className="ml-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </div>
                {option.count && (
                  <span className="text-sm text-gray-500">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        );

      case "range":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">السعر</span>
              <span className="text-sm font-medium text-emerald-600">
                {activeFilters[group.id]?.[0] || "0"} - {activeFilters[group.id]?.[1] || "∞"}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="الحد الأدنى"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  value={activeFilters[group.id]?.[0] || ""}
                  onChange={(e) => {
                    const current = activeFilters[group.id] || [];
                    onFilterChange(group.id, e.target.value);
                  }}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="الحد الأقصى"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  value={activeFilters[group.id]?.[1] || ""}
                  onChange={(e) => {
                    const current = activeFilters[group.id] || [];
                    onFilterChange(group.id, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`} dir="rtl">
      {/* رأس الفلاتر */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SlidersHorizontal className="h-5 w-5 text-gray-600 ml-2" />
            <h3 className="font-semibold text-gray-900">الفلاتر</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              مسح الكل
            </button>
          )}
        </div>
      </div>

      {/* قائمة الفلاتر */}
      <div className="divide-y divide-gray-200">
        {filters.map((group) => {
          const isExpanded = expandedGroups.has(group.id);
          const activeCount = getActiveCount(group.id);

          return (
            <div key={group.id} className="overflow-hidden">
              {/* رأس المجموعة */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900">{group.title}</h4>
                  {activeCount > 0 && (
                    <span className="mr-2 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                      {activeCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {activeCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearGroup(group.id);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="مسح فلاتر المجموعة"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </button>

              {/* محتوى الفلتر */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  {renderFilterContent(group)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* تذييل الفلاتر */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {Object.values(activeFilters).reduce(
                (total, filters) => total + filters.length,
                0
              )}{" "}
              فلتر نشط
            </span>
            <button
              onClick={onClearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              مسح جميع الفلاتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// بيانات تجريبية للفلاتر
export const defaultFilters: FilterGroup[] = [
  {
    id: "category",
    title: "الفئات",
    type: "checkbox",
    options: [
      { id: "parapharmacie", label: "شبه صيدلية", count: 45 },
      { id: "herbal", label: "الأعشاب الطبية", count: 32 },
      { id: "cosmetics", label: "مستحضرات التجميل", count: 28 },
      { id: "organic", label: "منتجات عضوية", count: 19 },
    ],
  },
  {
    id: "price",
    title: "السعر",
    type: "range",
    options: [],
  },
  {
    id: "brand",
    title: "العلامات التجارية",
    type: "checkbox",
    options: [
      { id: "bio-para", label: "BioPara", count: 12 },
      { id: "naturel", label: "Naturel", count: 8 },
      { id: "herbal-pro", label: "Herbal Pro", count: 15 },
      { id: "cosmetic-plus", label: "Cosmetic Plus", count: 9 },
    ],
  },
  {
    id: "rating",
    title: "التقييم",
    type: "radio",
    options: [
      { id: "4", label: "4 نجوم فأكثر", count: 67 },
      { id: "3", label: "3 نجوم فأكثر", count: 89 },
      { id: "2", label: "نجمتان فأكثر", count: 102 },
      { id: "1", label: "جميع التقييمات", count: 124 },
    ],
  },
  {
    id: "availability",
    title: "التوفر",
    type: "checkbox",
    options: [
      { id: "in-stock", label: "متوفر في المخزون", count: 98 },
      { id: "sale", label: "عروض مخفضة", count: 23 },
      { id: "new", label: "منتجات جديدة", count: 15 },
    ],
  },
];

export default ProductFilters;
