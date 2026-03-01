import { createClient } from '@supabase/supabase-js'
import { Database as DatabaseType } from './server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('❌ Missing env.NEXT_PUBLIC_SUPABASE_URL')
if (!supabaseAnonKey) throw new Error('❌ Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')

export const supabaseClient = createClient<DatabaseType>(supabaseUrl, supabaseAnonKey)

export type Database = DatabaseType
