import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/data/products'
import ProductDetail from './ProductDetail'

// Enable dynamic rendering for all product slugs
export const dynamicParams = true

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'المنتج غير موجود | BioPara',
      description: 'المنتج الذي تبحث عنه غير موجود'
    }
  }

  return {
    title: product.meta_title || `${product.name_ar || product.name} | BioPara`,
    description: product.meta_description || product.description_ar || product.description || `اشترِ ${product.name_ar || product.name} من BioPara - منتجات طبيعية عالية الجودة`,
    keywords: [
      ...(product.seo_keywords || []),
      product.name_ar || product.name,
      product.name,
      ...(product.categories ? [product.categories.name_ar, product.categories.name] : []),
      'منتجات طبيعية',
      'BioPara'
    ],
    openGraph: {
      title: product.meta_title || `${product.name_ar || product.name} | BioPara`,
      description: product.meta_description || product.description_ar || product.description || `اشترِ ${product.name_ar || product.name} من BioPara`,
      images: product.images?.[0] ? [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.name_ar || product.name
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.meta_title || `${product.name_ar || product.name} | BioPara`,
      description: product.meta_description || product.description_ar || product.description || `اشترِ ${product.name_ar || product.name} من BioPara`,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
