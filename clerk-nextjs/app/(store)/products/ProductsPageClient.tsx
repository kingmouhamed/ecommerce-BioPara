'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product, Category, PaginatedProducts } from '@/lib/data/products'
import ProductCard from '@/components/products/EnhancedProductCard'
import ProductSkeleton from '@/components/ui/ProductSkeleton'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/ui/Pagination'
import SidebarFilters from '@/components/products/SidebarFilters'

interface ProductsPageClientProps {
  initialProducts: PaginatedProducts
  categories: Category[]
  initialQuery: string
  initialCategory: string
  initialPage: number
  initialMinPrice?: number
  initialMaxPrice?: number
  initialInStock?: boolean
}

export default function ProductsPageClient({
  initialProducts,
  categories,
  initialQuery,
  initialCategory,
  initialPage,
  initialMinPrice,
  initialMaxPrice,
  initialInStock
}: ProductsPageClientProps) {
  const [products, setProducts] = useState<PaginatedProducts>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = async (
    query: string,
    category: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    page: number = 1
  ) => {
    setLoading(true)

    // تحديث URL
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (minPrice !== undefined) params.set('minPrice', minPrice.toString())
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString())
    if (inStock) params.set('inStock', 'true')
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
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const inStock = searchParams.get('inStock') === 'true'
    handleSearch(query, category, minPrice, maxPrice, inStock, page)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl h-96 animate-pulse"></div>
            </div>
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-3">المنتجات</h1>
          <p className="text-gray-600 text-lg">استكشف مجموعتنا المميزة من المنتجات الطبيعية والعلاجية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Bottom Sheet */}
          <div className="lg:col-span-1">
            <SidebarFilters
              categories={categories}
              initialQuery={initialQuery}
              initialCategory={initialCategory}
              initialMinPrice={initialMinPrice}
              initialMaxPrice={initialMaxPrice}
              initialInStock={initialInStock}
              onSearch={handleSearch}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results count & Clear */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-700 font-bold">
                {products.pagination.totalCount} منتج متوفر
              </p>
              {(searchParams.get('q') || searchParams.get('category') || searchParams.get('minPrice') || searchParams.get('inStock')) && (
                <button
                  onClick={() => handleSearch('', '', undefined, undefined, false, 1)}
                  className="text-sm text-emerald-600 hover:text-emerald-800 font-bold min-h-[44px] px-3"
                >
                  مسح كل الفلاتر
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              ) : products.products.length > 0 ? (
                products.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    title="لا توجد منتجات تطابق بحثك"
                    description="حاول تعديل الفلاتر أو إزالة بعض شروط البحث للوصول لنتائج أفضل."
                    action={{
                      label: 'مسح جميع الفلاتر',
                      onClick: () => handleSearch('', '', undefined, undefined, false, 1)
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
      </div>
    </div>
  )
}
