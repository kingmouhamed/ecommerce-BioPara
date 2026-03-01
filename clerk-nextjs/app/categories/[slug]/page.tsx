import { notFound } from 'next/navigation'
import { getCategoryWithProducts } from '@/lib/data/categories'
import CategoryPageClient from './CategoryPageClient'
import CategoryPageLoading from './loading'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryData = await getCategoryWithProducts(params.slug)
  
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
  const page = parseInt(searchParams.page || '1')
  const categoryData = await getCategoryWithProducts(params.slug, page)

  if (!categoryData) {
    notFound()
  }

  return (
    <CategoryPageClient 
      initialData={categoryData}
      initialPage={page}
    />
  )
}
