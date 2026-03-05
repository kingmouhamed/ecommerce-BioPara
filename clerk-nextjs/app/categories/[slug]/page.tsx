import { notFound } from 'next/navigation'
import { getCategoryWithProducts } from '@/lib/data/categories'
import CategoryPageClient from './CategoryPageClient'
import CategoryPageLoading from './loading'

// Enable dynamic rendering for all category slugs
export const dynamicParams = true

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryData = await getCategoryWithProducts(slug)
  
  if (!categoryData) {
    return {
      title: 'الفئة غير موجودة | BioPara',
      description: 'الفئة التي تبحث عنها غير موجودة'
    }
  }

  return {
    title: `${categoryData.category.name_ar || categoryData.category.name} | BioPara`,
    description: categoryData.category.description_ar || categoryData.category.description,
    openGraph: {
      title: `${categoryData.category.name_ar || categoryData.category.name} | BioPara`,
      description: categoryData.category.description_ar || categoryData.category.description,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1')
  const categoryData = await getCategoryWithProducts(slug, currentPage)

  if (!categoryData) {
    notFound()
  }

  return (
    <CategoryPageClient 
      initialData={categoryData}
      initialPage={currentPage}
    />
  )
}
