import { createClient } from '@supabase/supabase-js'

async function debugSupabase() {
  console.log('🔍 Supabase Debug Script')
  console.log('========================')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('\n📋 Environment Variables:')
  console.log(`- URL: ${supabaseUrl ? '✅ EXISTS' : '❌ MISSING'} (${supabaseUrl?.length || 0} chars)`)
  console.log(`- KEY: ${supabaseServiceKey ? '✅ EXISTS' : '❌ MISSING'} (${supabaseServiceKey?.length || 0} chars)`)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('\n❌ Environment variables missing!')
    process.exit(1)
  }

  // Test connection
  console.log('\n🔗 Testing Connection...')
  let supabase
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
    console.log('✅ Client created')
  } catch (error) {
    console.log('❌ Client creation failed:', error.message)
    process.exit(1)
  }

  // Check tables
  console.log('\n📊 Checking Tables...')

  // Test products table
  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Products table error:', error.message)
    } else {
      console.log(`✅ Products table: EXISTS (${count} records)`)
    }
  } catch (error) {
    console.log('❌ Products table check failed:', error.message)
  }

  // Test categories table
  try {
    const { data, error, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Categories table error:', error.message)
    } else {
      console.log(`✅ Categories table: EXISTS (${count} records)`)
    }
  } catch (error) {
    console.log('❌ Categories table check failed:', error.message)
  }

  // Test data fetch
  console.log('\n📥 Testing Data Fetch...')
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(1)

    if (error) {
      console.log('❌ Data fetch error:', error.message)
    } else {
      console.log(`✅ Data fetch successful: ${data?.length || 0} products`)
    }
  } catch (error) {
    console.log('❌ Data fetch failed:', error.message)
  }

  console.log('\n✨ Debug complete!')
}

debugSupabase().catch(console.error)
