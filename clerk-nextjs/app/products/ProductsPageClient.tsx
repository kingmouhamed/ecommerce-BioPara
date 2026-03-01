'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product, Category, PaginatedProducts } from '@/lib/data/products'
import ProductCard from '@/components/products/EnhancedProductCard'
import ProductSkeleton from '@/components/ui/ProductSkeleton'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/ui/Pagination'
import SearchFilters from '@/components/SearchFilters'

interface ProductsPageClientProps {
  initialProducts: PaginatedProducts
  categories: Category[]
  initialQuery: string
  initialCategory: string
  initialPage: number
}

export default function ProductsPageClient({
  initialProducts,
  categories,
  initialQuery,
  initialCategory,
  initialPage
}: ProductsPageClientProps) {
  const [products, setProducts] = useState<PaginatedProducts>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = async (query: string, category: string, page: number = 1) => {
    setLoading(true)

    // تحديث URL
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (page > 1) params.set('page', page.toString())

    const newUrl = `/products?${params.toString()}`
    router.push(newUrl, { scroll: false })

    try {
      // جلب البيانات الجديدة
      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
      } else {
        console.error('Failed to fetch products:', data.error)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    handleSearch(query, category, page)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            المنتجات
          </h1>
          <p className="text-gray-600">
            استكشف مجموعتنا المميزة من المنتجات الطبيعية والعلاجية
          </p>
        </div>

        {/* Filters */}
        <SearchFilters
          categories={categories}
          initialQuery={initialQuery}
          initialCategory={initialCategory}
          onSearch={handleSearch}
        />

        {/* Results count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {products.pagination.totalCount} منتج متوفر
          </p>

          {searchParams.get('q') && (
            <button
              onClick={() => handleSearch('', '', 1)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              مسح الفلتر
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : products.products.length > 0 ? (
            products.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="لا توجد منتجات"
                description="لم نجد أي منتجات تطابق بحثك. حاول تغيير الفلاتر أو البحث."
                action={{
                  label: 'مسح الفلاتر',
                  onClick: () => handleSearch('', '', 1)
                }}
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {products.pagination.totalPages > 1 && (
          <Pagination
            currentPage={products.pagination.currentPage}
            totalPages={products.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
