"use client";

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range';
}

const filterSections: FilterSection[] = [
  {
    id: 'category',
    title: 'الفئة',
    type: 'checkbox',
    options: [
      { id: 'medical-herbs', label: 'الأعشاب الطبية', count: 45 },
      { id: 'parapharmacie', label: 'Parapharmacie', count: 38 },
      { id: 'vitamins', label: 'الفيتامينات', count: 28 },
      { id: 'organic', label: 'منتجات عضوية', count: 22 }
    ]
  },
  {
    id: 'brand',
    title: 'الماركة',
    type: 'checkbox',
    options: [
      { id: 'la-roche-posay', label: 'La Roche-Posay', count: 15 },
      { id: 'vichy', label: 'Vichy', count: 12 },
      { id: 'cerave', label: 'CeraVe', count: 10 },
      { id: 'bioderma', label: 'Bioderma', count: 8 },
      { id: 'avene', label: 'Avène', count: 7 }
    ]
  },
  {
    id: 'price',
    title: 'السعر',
    type: 'range',
    options: [
      { id: '0-100', label: '0 - 100 درهم' },
      { id: '100-300', label: '100 - 300 درهم' },
      { id: '300-500', label: '300 - 500 درهم' },
      { id: '500+', label: 'أكثر من 500 درهم' }
    ]
  },
  {
    id: 'rating',
    title: 'التقييم',
    type: 'radio',
    options: [
      { id: '5', label: '5 نجوم' },
      { id: '4', label: '4 نجوم فأكثر' },
      { id: '3', label: '3 نجوم فأكثر' }
    ]
  }
];

interface ProductFiltersProps {
  onFiltersChange?: (filters: any) => void;
  className?: string;
}

export default function ProductFilters({ onFiltersChange, className = '' }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price']);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFilterChange = (sectionId: string, optionId: string, checked: boolean) => {
    const newFilters = { ...selectedFilters };
    
    if (checked) {
      if (!newFilters[sectionId]) {
        newFilters[sectionId] = [];
      }
      newFilters[sectionId].push(optionId);
    } else {
      newFilters[sectionId] = newFilters[sectionId].filter(id => id !== optionId);
      if (newFilters[sectionId].length === 0) {
        delete newFilters[sectionId];
      }
    }
    
    setSelectedFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFiltersChange?.({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">الفلاتر</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            مسح الكل
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {filterSections.map((section) => (
          <div key={section.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full text-right mb-3"
            >
              <h4 className="font-medium text-gray-800">{section.title}</h4>
              {expandedSections.includes(section.id) ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {expandedSections.includes(section.id) && (
              <div className="space-y-3">
                {section.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type={section.type}
                        name={section.id}
                        checked={selectedFilters[section.id]?.includes(option.id) || false}
                        onChange={(e) => handleFilterChange(section.id, option.id, e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </div>
                    {option.count && (
                      <span className="text-sm text-gray-400">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">الفلاتر النشطة:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([sectionId, filterIds]) =>
              filterIds.map((filterId) => {
                const section = filterSections.find(s => s.id === sectionId);
                const option = section?.options.find(o => o.id === filterId);
                return (
                  <span
                    key={`${sectionId}-${filterId}`}
                    className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full"
                  >
                    {option?.label}
                    <button
                      onClick={() => handleFilterChange(sectionId, filterId, false)}
                      className="hover:text-emerald-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
