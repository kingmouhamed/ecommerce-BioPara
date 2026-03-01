import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/data/products'
import ProductDetail from './ProductDetail'
import ProductDetailLoading from './loading'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'المنتج غير موجود | BioPara',
      description: 'المنتج الذي تبحث عنه غير موجود'
    }
  }

  return {
    title: `${product.name_ar || product.name} | BioPara`,
    description: product.description_ar || product.description,
    keywords: [
      product.name_ar || product.name,
      product.name,
      ...(product.categories ? [product.categories.name_ar, product.categories.name] : [])
    ],
    openGraph: {
      title: `${product.name_ar || product.name} | BioPara`,
      description: product.description_ar || product.description,
      images: product.images?.[0] ? [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.name_ar || product.name
        }
      ] : [],
      type: 'product',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
