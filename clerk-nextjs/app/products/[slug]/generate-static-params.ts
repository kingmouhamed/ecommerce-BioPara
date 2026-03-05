import { getProducts } from '@/lib/data/products'

export async function generateStaticParams() {
  try {
    // Fetch all products to generate static params
    const { products } = await getProducts({ limit: 100 }) // Get all products
    
    // Return array of params objects with slug
    return products.map((product) => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for products:', error)
    // Return empty array if error occurs
    return []
  }
}
