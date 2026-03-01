'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Category } from '@/lib/data/products'
import ProductCard from '@/components/products/EnhancedProductCard'
import ProductSkeleton from '@/components/ui/ProductSkeleton'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/ui/Pagination'

interface CategoryPageClientProps {
  initialData: {
    category: Category
    products: any[]
    pagination: {
      currentPage: number
      totalPages: number
      totalCount: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
  initialPage: number
}

function CategoryPageClient({
  initialData,
  initialPage
}: CategoryPageClientProps) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePageChange = async (page: number) => {
    setLoading(true)

    // تحديث URL
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }

    const newUrl = `/categories/${initialData.category.slug}?${params.toString()}`
    router.push(newUrl, { scroll: false })

    try {
      // جلب البيانات الجديدة
      const response = await fetch(`/api/categories/${initialData.category.slug}?page=${page}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        console.error('Failed to fetch category products:', result.error)
      }
    } catch (error) {
      console.error('Error fetching category products:', error)
    } finally {
      setLoading(false)
    }
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
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {initialData.category.name_ar || initialData.category.name}
            </h1>
            <span className="text-gray-600">
              {data.pagination.totalCount} منتج
            </span>
          </div>

          {initialData.category.description_ar && (
            <p className="text-gray-600 max-w-3xl">
              {initialData.category.description_ar}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : data.products.length > 0 ? (
            data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="لا توجد منتجات في هذه الفئة"
                description="لم نجد أي منتجات في هذه الفئة حالياً. تحقق من الفئات الأخرى."
                action={{
                  label: 'تصفح جميع المنتجات',
                  onClick: () => router.push('/products')
                }}
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <Pagination
            currentPage={data.pagination.currentPage}
            totalPages={data.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}

export default CategoryPageClient
