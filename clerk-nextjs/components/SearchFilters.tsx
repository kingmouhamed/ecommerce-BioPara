'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/lib/data/products'

interface SearchFiltersProps {
  categories: Category[]
  initialQuery: string
  initialCategory: string
  onSearch: (query: string, category: string, page?: number) => void
}

export default function SearchFilters({
  categories,
  initialQuery,
  initialCategory,
  onSearch
}: SearchFiltersProps) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query, category, 1)
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    onSearch(query, newCategory, 1)
  }

  const handleClear = () => {
    setQuery('')
    setCategory('')
    onSearch('', '', 1)
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              البحث عن المنتجات
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن اسم المنتج أو الوصف..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              الفئة
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">جميع الفئات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name_ar || cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 space-x-reverse">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              بحث
            </button>
            {(query || category) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                مسح
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(query || category) && (
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <span>فلاتر نشطة:</span>
              {query && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  بحث: &quot;{query}&quot;
                </span>
              )}
              {category && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  فئة: {categories.find(c => c.slug === category)?.name_ar || category}
                </span>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
