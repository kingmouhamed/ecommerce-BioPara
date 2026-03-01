import { createClient } from '@supabase/supabase-js'

async function debugSupabase() {
  console.log('=== Supabase Debug Script ===')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Environment Variables:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ EXISTS' : '❌ MISSING')
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ EXISTS' : '❌ MISSING')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Environment variables are missing. Please check your .env.local file.')
    process.exit(1)
  }

  // Test connection
  try {
    console.log('\nTesting Supabase Connection...')

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test 1: Check if tables exist
    console.log('Testing table existence...')

    const { data: productsTable, error: productsError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })

    if (productsError) {
      console.log('❌ Products table error:', productsError.message)
    } else {
      console.log('✅ Products table exists')
    }

    const { data: categoriesTable, error: categoriesError } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true })

    if (categoriesError) {
      console.log('❌ Categories table error:', categoriesError.message)
    } else {
      console.log('✅ Categories table exists')
    }

    // Test 2: Try to fetch some data
    console.log('\nTesting data fetching...')

    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (fetchError) {
      console.log('❌ Fetch error:', fetchError.message)
      console.log('Error details:', fetchError)
    } else {
      console.log(`✅ Successfully fetched ${products?.length || 0} products`)
      if (products && products.length > 0) {
        console.log('Sample product:', products[0])
      }
    }

    // Test 3: Check RLS policies
    console.log('\nTesting RLS policies...')
    const { data: categories, error: categoriesFetchError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)

    if (categoriesFetchError) {
      console.log('❌ Categories fetch error:', categoriesFetchError.message)
      console.log('This might be an RLS policy issue')
    } else {
      console.log(`✅ Successfully fetched ${categories?.length || 0} categories`)
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error)
  }
}

debugSupabase().catch(console.error)
