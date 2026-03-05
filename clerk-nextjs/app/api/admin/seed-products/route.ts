import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { generateSlug } from '@/lib/utils/slug'
import { auth } from '@clerk/nextjs/server'

// Get supabase client
const supabaseAdmin = getSupabaseAdmin()

const demoProducts = [
  {
    name: 'Chamomile Tea',
    name_ar: 'شاي البابونج',
    description: 'Relaxing chamomile tea perfect for bedtime',
    description_ar: 'شاي البابونج المريح المثالي لوقت النوم',
    price: 29.99,
    currency: 'MAD',
    stock: 100,
    images: ['/images/products/chamomile.jpg'],
    category_id: 1,
    is_active: true,
    featured: true
  },
  {
    name: 'Lavender Essential Oil',
    name_ar: 'زيت اللافندر العطري',
    description: 'Pure lavender essential oil for aromatherapy',
    description_ar: 'زيت اللافندر العطري النقي للعلاج بالروائح',
    price: 89.99,
    currency: 'MAD',
    stock: 50,
    images: ['/images/products/lavender.jpg'],
    category_id: 1,
    is_active: true,
    featured: true
  },
  {
    name: 'Honey Premium',
    name_ar: 'عسل ممتاز',
    description: 'Premium natural honey from mountain flowers',
    description_ar: 'عسل طبيعي ممتاز من أزهار الجبال',
    price: 149.99,
    currency: 'MAD',
    stock: 75,
    images: ['/images/products/honey.jpg'],
    category_id: 1,
    is_active: true,
    featured: false
  },
  {
    name: 'Argan Oil',
    name_ar: 'زيت الأركان',
    description: 'Pure Moroccan argan oil for skin and hair',
    description_ar: 'زيت الأركان المغربي النقي للبشرة والشعر',
    price: 199.99,
    currency: 'MAD',
    stock: 60,
    images: ['/images/products/argan.jpg'],
    category_id: 2,
    is_active: true,
    featured: true
  },
  {
    name: 'Rosemary',
    name_ar: 'إكليل الجبل',
    description: 'Fresh rosemary for cooking and medicinal use',
    description_ar: 'إكليل الجبل الطازج للطبخ والاستخدام الطبي',
    price: 19.99,
    currency: 'MAD',
    stock: 120,
    images: ['/images/products/rosemary.jpg'],
    category_id: 1,
    is_active: true,
    featured: false
  },
  {
    name: 'Thyme',
    name_ar: 'الزعتر',
    description: 'Aromatic thyme for culinary and medicinal purposes',
    description_ar: 'الزعتر العطري للأغراض الطبية والطهي',
    price: 24.99,
    currency: 'MAD',
    stock: 90,
    images: ['/images/products/thyme.jpg'],
    category_id: 1,
    is_active: true,
    featured: false
  },
  {
    name: 'Green Tea',
    name_ar: 'الشاي الأخضر',
    description: 'Premium green tea rich in antioxidants',
    description_ar: 'شاي أخضر ممتاز غني بمضادات الأكسدة',
    price: 39.99,
    currency: 'MAD',
    stock: 80,
    images: ['/images/products/green-tea.jpg'],
    category_id: 1,
    is_active: true,
    featured: false
  },
  {
    name: 'Eucalyptus Oil',
    name_ar: 'زيت الكافور',
    description: 'Refreshing eucalyptus essential oil',
    description_ar: 'زيت الكافور العطري المنعش',
    price: 79.99,
    currency: 'MAD',
    stock: 40,
    images: ['/images/products/eucalyptus.jpg'],
    category_id: 2,
    is_active: true,
    featured: false
  },
  {
    name: 'Peppermint',
    name_ar: 'النعناع',
    description: 'Fresh peppermint leaves for tea and remedies',
    description_ar: 'أوراق النعناع الطازجة للشاي والعلاجات',
    price: 22.99,
    currency: 'MAD',
    stock: 110,
    images: ['/images/products/peppermint.jpg'],
    category_id: 1,
    is_active: true,
    featured: false
  },
  {
    name: 'Tea Tree Oil',
    name_ar: 'زيت شجرة الشاي',
    description: 'Antiseptic tea tree oil for skin care',
    description_ar: 'زيت شجرة الشاي المطهر للعناية بالبشرة',
    price: 69.99,
    currency: 'MAD',
    stock: 55,
    images: ['/images/products/tea-tree.jpg'],
    category_id: 2,
    is_active: true,
    featured: false
  }
]

const demoCategories = [
  {
    name: 'Medical Herbs',
    name_ar: 'الأعشاب الطبية',
    slug: 'medical-herbs',
    description: 'Natural medicinal herbs and plants',
    description_ar: 'أعشاب ونباتات طبية طبيعية',
    image: '/images/categories/herbs.jpg'
  },
  {
    name: 'Essential Oils',
    name_ar: 'الزيوت العطرية',
    slug: 'essential-oils',
    description: 'Pure essential oils for aromatherapy',
    description_ar: 'زيوت عطرية نقية للعلاج بالروائح',
    image: '/images/categories/oils.jpg'
  }
]

export async function POST() {
  try {
    // Verify admin authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if categories exist
    const { data: existingCategories } = await supabaseAdmin
      .from('categories')
      .select('*')
      .limit(1)

    // Seed categories if empty
    if (!existingCategories || existingCategories.length === 0) {
      for (const category of demoCategories) {
        await supabaseAdmin
          .from('categories')
          .insert({
            ...category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      }
    }

    // Check if products exist
    const { data: existingProducts } = await supabaseAdmin
      .from('products')
      .select('*')
      .limit(1)

    // Seed products if empty
    if (!existingProducts || existingProducts.length === 0) {
      // Get categories to map IDs
      const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('*')

      const categoryMap = categories?.reduce((acc: any, cat: any) => {
        acc[cat.name] = cat.id
        return acc
      }, {} as Record<string, any>) || {}

      for (const product of demoProducts) {
        const slug = generateSlug(product.name)
        await supabaseAdmin
          .from('products')
          .insert({
            ...product,
            slug,
            category_id: categoryMap[product.category_id === 1 ? 'Medical Herbs' : 'Essential Oils'] || product.category_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      productsSeeded: demoProducts.length,
      categoriesSeeded: demoCategories.length
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
