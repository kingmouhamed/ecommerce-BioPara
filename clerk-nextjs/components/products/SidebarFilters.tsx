'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/lib/data/products'
import { X, Filter } from 'lucide-react'

interface SidebarFiltersProps {
  categories: Category[]
  initialQuery: string
  initialCategory: string
  initialMinPrice?: number
  initialMaxPrice?: number
  initialInStock?: boolean
  onSearch: (
    query: string,
    category: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    page?: number
  ) => void
}

interface FilterContentProps {
  query: string
  setQuery: (value: string) => void
  category: string
  setCategory: (value: string) => void
  minPrice: number | ''
  setMinPrice: (value: number | '') => void
  maxPrice: number | ''
  setMaxPrice: (value: number | '') => void
  inStock: boolean
  setInStock: (value: boolean) => void
  categories: Category[]
  handleSubmit: () => void
  handleClear: () => void
}

function FilterContent({
  query,
  setQuery,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStock,
  setInStock,
  categories,
  handleSubmit,
  handleClear
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label htmlFor="search" className="block text-sm font-bold text-gray-800 mb-2">
          البحث عن المنتجات
        </label>
        <input
          type="text"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث هنا..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
        />
      </div>

      {/* Category List */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">الفئات</label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={category === ''}
              onChange={() => setCategory('')}
              className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
            />
            <span className="text-gray-700 group-hover:text-emerald-700 transition-colors">جميع الفئات</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={category === cat.slug}
                onChange={(e) => setCategory(e.target.value)}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <span className="text-gray-700 group-hover:text-emerald-700 transition-colors">
                {cat.name_ar || cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">السعر (درهم)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="من"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-center"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min="0"
            placeholder="إلى"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-center"
          />
        </div>
      </div>

      {/* In Stock Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <span className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
            متوفر في المخزون فقط
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => handleSubmit()}
          className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md min-h-[44px]"
        >
          تطبيق الفلاتر
        </button>
        {(query || category || minPrice !== '' || maxPrice !== '' || inStock) && (
          <button
            onClick={handleClear}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all min-h-[44px]"
            title="مسح الفلاتر"
          >
            مسح
          </button>
        )}
      </div>
    </div>
  )
}

export default function SidebarFilters({
  categories,
  initialQuery,
  initialCategory,
  initialMinPrice,
  initialMaxPrice,
  initialInStock,
  onSearch
}: SidebarFiltersProps) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [minPrice, setMinPrice] = useState<number | ''>(initialMinPrice ?? '')
  const [maxPrice, setMaxPrice] = useState<number | ''>(initialMaxPrice ?? '')
  const [inStock, setInStock] = useState<boolean>(initialInStock ?? false)

  const [isOpen, setIsOpen] = useState(false) // For mobile bottom sheet
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    onSearch(
      query,
      category,
      minPrice === '' ? undefined : minPrice,
      maxPrice === '' ? undefined : maxPrice,
      inStock,
      1
    )
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setInStock(false)
    onSearch('', '', undefined, undefined, false, 1)
    setIsOpen(false)
  }

  if (!mounted) return <div className="animate-pulse bg-white p-6 rounded-2xl h-96"></div>

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 transition-colors min-h-[44px]"
        >
          <Filter className="w-5 h-5" />
          تصفية المنتجات
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          الفلاتر
        </h2>
        <FilterContent
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          inStock={inStock}
          setInStock={setInStock}
          categories={categories}
          handleSubmit={handleSubmit}
          handleClear={handleClear}
        />
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-transform duration-300 transform ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-600" />
              تصفية المنتجات
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <FilterContent
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStock={inStock}
            setInStock={setInStock}
            categories={categories}
            handleSubmit={handleSubmit}
            handleClear={handleClear}
          />
        </div>
      </div>
    </>
  )
}
