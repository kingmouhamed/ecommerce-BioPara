'use client';

import { useState, useEffect } from 'react';

interface FilterSidebarProps {
  categories: { id: number; name: string; name_ar: string; slug: string }[];
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    rating?: number;
    inStock?: boolean;
    sort?: string;
  }) => void;
  currentFilters: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    rating?: number;
    inStock?: boolean;
    sort?: string;
  };
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'rating', label: 'الأعلى تقييماً' },
  { value: 'price_asc', label: 'السعر: من الأقل' },
  { value: 'price_desc', label: 'السعر: من الأعلى' },
];

const RATING_OPTIONS = [
  { value: 4, label: '4 نجوم فأكثر' },
  { value: 3, label: '3 نجوم فأكثر' },
  { value: 0, label: 'الكل' },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? '#C8963E' : 'none'}
      stroke={filled ? '#C8963E' : '#9CA3AF'}
      strokeWidth={1.5}
      className="w-4 h-4 inline-block"
    >
      <path
        strokeLinejoin="round"
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  );
}

function FilterContent({
  categories,
  onFilterChange,
  currentFilters,
}: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState<string>(
    currentFilters.minPrice !== undefined ? String(currentFilters.minPrice) : ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    currentFilters.maxPrice !== undefined ? String(currentFilters.maxPrice) : ''
  );

  const hasActiveFilters =
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined ||
    currentFilters.category !== undefined ||
    (currentFilters.rating !== undefined && currentFilters.rating !== 0) ||
    currentFilters.inStock === true ||
    (currentFilters.sort !== undefined && currentFilters.sort !== 'newest');

  function clearAll() {
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({});
  }

  function handleSortChange(value: string) {
    onFilterChange({ ...currentFilters, sort: value });
  }

  function handleMinPrice(value: string) {
    setMinPrice(value);
    const num = parseFloat(value);
    onFilterChange({
      ...currentFilters,
      minPrice: isNaN(num) ? undefined : num,
    });
  }

  function handleMaxPrice(value: string) {
    setMaxPrice(value);
    const num = parseFloat(value);
    onFilterChange({
      ...currentFilters,
      maxPrice: isNaN(num) ? undefined : num,
    });
  }

  function handleCategoryChange(slug: string) {
    const newCat = currentFilters.category === slug ? undefined : slug;
    onFilterChange({ ...currentFilters, category: newCat });
  }

  function handleRatingChange(value: number) {
    onFilterChange({ ...currentFilters, rating: value });
  }

  function handleInStock(checked: boolean) {
    const updated = { ...currentFilters };
    if (checked) {
      updated.inStock = true;
    } else {
      delete updated.inStock;
    }
    onFilterChange(updated);
  }

  function removeFilter(key: string) {
    const updated = { ...currentFilters };
    if (key === 'minPrice') { delete updated.minPrice; setMinPrice(''); }
    else if (key === 'maxPrice') { delete updated.maxPrice; setMaxPrice(''); }
    else if (key === 'category') delete updated.category;
    else if (key === 'rating') delete updated.rating;
    else if (key === 'inStock') delete updated.inStock;
    else if (key === 'sort') delete updated.sort;
    onFilterChange(updated);
  }

  // Build active pill list
  const pills: { key: string; label: string }[] = [];
  if (currentFilters.sort && currentFilters.sort !== 'newest') {
    const opt = SORT_OPTIONS.find((o) => o.value === currentFilters.sort);
    if (opt) pills.push({ key: 'sort', label: opt.label });
  }
  if (currentFilters.minPrice !== undefined) {
    pills.push({ key: 'minPrice', label: `من ${currentFilters.minPrice} درهم` });
  }
  if (currentFilters.maxPrice !== undefined) {
    pills.push({ key: 'maxPrice', label: `حتى ${currentFilters.maxPrice} درهم` });
  }
  if (currentFilters.category) {
    const cat = categories.find((c) => c.slug === currentFilters.category);
    if (cat) pills.push({ key: 'category', label: cat.name_ar });
  }
  if (currentFilters.rating && currentFilters.rating > 0) {
    pills.push({ key: 'rating', label: `${currentFilters.rating} نجوم فأكثر` });
  }
  if (currentFilters.inStock) {
    pills.push({ key: 'inStock', label: 'متوفر فقط' });
  }

  return (
    <div dir="rtl" className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2D4A2E]">تصفية النتائج</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-[#C8963E] hover:underline font-medium transition-colors"
          >
            مسح الكل
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center gap-1.5 bg-[#2D4A2E]/10 text-[#2D4A2E] text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {pill.label}
              <button
                onClick={() => removeFilter(pill.key)}
                className="hover:text-red-500 transition-colors leading-none text-base"
                aria-label={`إزالة فلتر ${pill.label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <hr className="border-gray-200" />

      {/* Sort */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          الترتيب
        </h3>
        <select
          value={currentFilters.sort ?? 'newest'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D4A2E]/30 focus:border-[#2D4A2E] transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <hr className="border-gray-200" />

      {/* Price range */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          نطاق السعر
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min={0}
              max={500}
              placeholder="0"
              value={minPrice}
              onChange={(e) => handleMinPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 pl-12 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D4A2E]/30 focus:border-[#2D4A2E] transition-all"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              درهم
            </span>
          </div>
          <span className="text-gray-400 text-sm shrink-0">—</span>
          <div className="relative flex-1">
            <input
              type="number"
              min={0}
              max={500}
              placeholder="500"
              value={maxPrice}
              onChange={(e) => handleMaxPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 pl-12 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D4A2E]/30 focus:border-[#2D4A2E] transition-all"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              درهم
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Categories */}
      {categories.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              التصنيفات
            </h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => {
                const checked = currentFilters.category === cat.slug;
                return (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCategoryChange(cat.slug)}
                      className="w-4 h-4 rounded border-gray-300 focus:ring-[#2D4A2E]/30 cursor-pointer accent-[#2D4A2E]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#2D4A2E] transition-colors">
                      {cat.name_ar}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <hr className="border-gray-200" />
        </>
      )}

      {/* Rating */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          التقييم
        </h3>
        <div className="flex flex-col gap-2.5">
          {RATING_OPTIONS.map((opt) => {
            const selected = (currentFilters.rating ?? 0) === opt.value;
            return (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating-filter"
                  checked={selected}
                  onChange={() => handleRatingChange(opt.value)}
                  className="w-4 h-4 border-gray-300 focus:ring-[#2D4A2E]/30 cursor-pointer accent-[#2D4A2E]"
                />
                <span className="flex items-center gap-1.5 text-sm text-gray-700 group-hover:text-[#2D4A2E] transition-colors">
                  {opt.value > 0 && (
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} filled={i < opt.value} />
                      ))}
                    </span>
                  )}
                  <span>{opt.label}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Availability */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          التوفر
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={currentFilters.inStock === true}
            onChange={(e) => handleInStock(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 focus:ring-[#2D4A2E]/30 cursor-pointer accent-[#2D4A2E]"
          />
          <span className="text-sm text-gray-700 group-hover:text-[#2D4A2E] transition-colors">
            المتوفر فقط
          </span>
        </label>
      </div>
    </div>
  );
}

export default function FilterSidebar(props: FilterSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        dir="rtl"
        className="hidden lg:block w-72 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 self-start sticky top-4"
      >
        <FilterContent {...props} />
      </aside>

      {/* Mobile: trigger button */}
      <div className="lg:hidden" dir="rtl">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-[#2D4A2E] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:bg-[#3D5A3E] active:scale-95 transition-all"
          aria-label="فتح قائمة التصفية"
          aria-expanded={drawerOpen}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M7 12h10M11 20h2"
            />
          </svg>
          تصفية
        </button>
      </div>

      {/* Mobile bottom sheet drawer */}
      <div className="lg:hidden" dir="rtl">
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
            drawerOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <div
          className={`fixed bottom-0 right-0 left-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ maxHeight: '85dvh' }}
          role="dialog"
          aria-modal="true"
          aria-label="قائمة التصفية"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#2D4A2E]">تصفية النتائج</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              aria-label="إغلاق"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div
            className="overflow-y-auto px-6 py-4"
            style={{ maxHeight: 'calc(85dvh - 130px)' }}
          >
            <FilterContent {...props} />
          </div>

          {/* Apply button */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full bg-[#2D4A2E] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#3D5A3E] active:scale-[0.98] transition-all"
            >
              تطبيق الفلاتر
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
