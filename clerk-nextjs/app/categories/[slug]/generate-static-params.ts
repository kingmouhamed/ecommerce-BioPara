import { getCategories } from '@/lib/data/categories'

export async function generateStaticParams() {
  try {
    // Fetch all categories to generate static params
    const categories = await getCategories()
    
    // Return array of params objects with slug
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    // Return empty array if error occurs
    return []
  }
}
