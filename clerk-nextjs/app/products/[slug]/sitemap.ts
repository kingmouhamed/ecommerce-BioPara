import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/data/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all products
    const productsData = await getProducts({ limit: 1000 }) // Get all products
    
    const productUrls = productsData.products.map((product) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
      lastModified: product.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...productUrls,
    ]
  } catch (error) {
    console.error('Error generating product sitemap:', error)
    return [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
