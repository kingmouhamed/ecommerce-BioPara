import { Suspense } from 'react'
import { getProducts } from '@/lib/data/products'
import { getCategories } from '@/lib/data/categories'
import ProductsPageClient from './ProductsPageClient'
import ProductsLoading from './loading'

export const metadata = {
  title: 'المنتجات | BioPara',
  description: 'استكشف مجموعتنا المميزة من المنتجات الطبيعية والعلاجية',
  keywords: ['منتجات طبيعية', 'عسل', 'أعشاب', 'زيوت عطرية', 'BioPara'],
  openGraph: {
    title: 'المنتجات | BioPara',
    description: 'استكشف مجموعتنا المميزة من المنتجات الطبيعية والعلاجية',
    type: 'website',
  },
}

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ''
  const category = resolvedSearchParams.category || ''
  const page = parseInt(resolvedSearchParams.page || '1')

  let productsData;
  let categories: any[] = [];
  let fetchError = null;

  try {
    // جلب البيانات من الخادم
    [productsData, categories] = await Promise.all([
      getProducts({ query, category, page }),
      getCategories()
    ])
  } catch (error) {
    console.error('💥 Failed to load products page data:', error)
    fetchError = error instanceof Error ? error.message : 'Unknown Error'
    productsData = {
      products: [],
      categories: [],
      pagination: { currentPage: 1, totalPages: 1, totalCount: 0, hasNextPage: false, hasPreviousPage: false }
    }
    categories = []
  }

  return (
    <Suspense fallback={<ProductsLoading />}>
      {fetchError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4 font-bold border border-red-200 shadow-sm max-w-4xl mx-auto">
          ⚠️ حدث خطأ أثناء جلب المنتجات: {fetchError}
          <br />
          <span className="text-sm font-normal">يرجى التحقق من أوامر قاعدة البيانات (Supabase Dashboard) أو تسجيلات السيرفر.</span>
        </div>
      )}
      <ProductsPageClient
        initialProducts={productsData}
        categories={categories}
        initialQuery={query}
        initialCategory={category}
        initialPage={page}
      />
    </Suspense>
  )
}
