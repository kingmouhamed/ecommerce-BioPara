
const { createClient } = require('@supabase/supabase-js');
const { products } = require('../products.js');

// WARNING: This script will delete all existing data in the 'products' table.
// Make sure to backup your data before running this script.

// Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // Use the secret key for admin operations

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or key is not defined. Make sure to have a .env.local file with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    // 1. Delete all existing data from the 'products' table
    const { error: deleteError } = await supabase.from('products').delete().gt('id', 0);
    if (deleteError) {
      throw deleteError;
    }
    console.log("✅ All existing products have been deleted.");

    // 2. Insert new data
    const { data, error } = await supabase.from('products').insert(products);

    if (error) {
      throw error;
    }

    console.log(`✅ Seeded ${products.length} products`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
