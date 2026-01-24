const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const setupDatabase = async () => {
  const client = await pool.connect();
  console.log('Connected to the PostgreSQL database.');

  try {
    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        description TEXT,
        category TEXT,
        price TEXT,
        originalPrice REAL,
        image TEXT,
        reviews INTEGER,
        rating REAL,
        isNew BOOLEAN
      )
    `);
    console.log('Products table created or already exists.');

    // Enable RLS on the products table
    await client.query('ALTER TABLE products ENABLE ROW LEVEL SECURITY');
    console.log('Row-Level Security enabled on products table.');

    // Policy for public read access
    await client.query(`
      DROP POLICY IF EXISTS "public_read_access_products" ON products;
      CREATE POLICY "public_read_access_products" ON products
      FOR SELECT USING (true)
    `);
    console.log('Public read access policy for products created.');

    // Policy for admins to have full access
    await client.query(`
      DROP POLICY IF EXISTS "admin_all_access_products" ON products;
      CREATE POLICY "admin_all_access_products" ON products
      FOR ALL USING (current_setting('app.current_user_role', true) = 'admin')
      WITH CHECK (current_setting('app.current_user_role', true) = 'admin')
    `);
    console.log('Admin all access policy for products created.');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists.');

    // Enable RLS on the users table
    await client.query('ALTER TABLE users ENABLE ROW LEVEL SECURITY');
    console.log('Row-Level Security enabled on users table.');

    // Add a default deny policy if it doesn't exist
    const policyCheck = await client.query("SELECT 1 FROM pg_policies WHERE policyname = 'default_deny_policy' AND tablename = 'users'");
    if (policyCheck.rowCount === 0) {
      await client.query(`CREATE POLICY "default_deny_policy" ON users FOR ALL USING (false) WITH CHECK (false)`);
      console.log('Default deny policy created on users table.');
    } else {
      console.log('Default deny policy already exists on users table.');
    }

    // Add an admin user
    const adminEmail = 'admin@biopara.com';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('FATAL ERROR: ADMIN_PASSWORD environment variable is not set.');
      console.error('Please add ADMIN_PASSWORD to the .env file.');
      // Release client and exit process
      client.release();
      pool.end();
      process.exit(1); 
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(adminPassword, saltRounds);

    const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminCheck.rowCount === 0) {
      await client.query(
        "INSERT INTO users (name, email, password, role) VALUES ('Admin', $1, $2, 'admin')",
        [adminEmail, hash]
      );
      console.log('Admin user created with new secure password.');
    } else {
      await client.query(
        "UPDATE users SET password = $1 WHERE email = $2",
        [hash, adminEmail]
      );
      console.log('Admin user already exists. Password has been updated to the new secure password.');
    }

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        delivery_info TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('Orders table created or already exists.');

    // Enable RLS on the orders table
    await client.query('ALTER TABLE orders ENABLE ROW LEVEL SECURITY');
    console.log('Row-Level Security enabled on orders table.');

    // Admin policy for orders
    const adminOrdersPolicyCheck = await client.query("SELECT 1 FROM pg_policies WHERE policyname = 'admin_all_access_orders' AND tablename = 'orders'");
    if (adminOrdersPolicyCheck.rowCount === 0) {
      await client.query(`CREATE POLICY "admin_all_access_orders" ON orders FOR ALL USING (current_setting('app.current_user_role', true) = 'admin') WITH CHECK (current_setting('app.current_user_role', true) = 'admin')`);
      console.log('Admin policy for orders created.');
    } else {
      console.log('Admin policy for orders already exists.');
    }

    // Customer SELECT policy for orders
    const customerSelectOrdersPolicyCheck = await client.query("SELECT 1 FROM pg_policies WHERE policyname = 'customer_select_own_orders' AND tablename = 'orders'");
    if (customerSelectOrdersPolicyCheck.rowCount === 0) {
      await client.query(`CREATE POLICY "customer_select_own_orders" ON orders FOR SELECT USING (user_id::text = current_setting('app.current_user_id', true))`);
      console.log('Customer SELECT policy for orders created.');
    } else {
      console.log('Customer SELECT policy for orders already exists.');
    }

    // Customer INSERT policy for orders
    const customerInsertOrdersPolicyCheck = await client.query("SELECT 1 FROM pg_policies WHERE policyname = 'customer_insert_own_orders' AND tablename = 'orders'");
    if (customerInsertOrdersPolicyCheck.rowCount === 0) {
      await client.query(`CREATE POLICY "customer_insert_own_orders" ON orders FOR INSERT WITH CHECK (user_id::text = current_setting('app.current_user_id', true))`);
      console.log('Customer INSERT policy for orders created.');
    } else {
      console.log('Customer INSERT policy for orders already exists.');
    }

    // Customer UPDATE policy for orders
    const customerUpdateOrdersPolicyCheck = await client.query("SELECT 1 FROM pg_policies WHERE policyname = 'customer_update_own_orders' AND tablename = 'orders'");
    if (customerUpdateOrdersPolicyCheck.rowCount === 0) {
      await client.query(`CREATE POLICY "customer_update_own_orders" ON orders FOR UPDATE USING (user_id::text = current_setting('app.current_user_id', true)) WITH CHECK (user_id::text = current_setting('app.current_user_id', true))`);
      console.log('Customer UPDATE policy for orders created.');
    } else {
      console.log('Customer UPDATE policy for orders already exists.');
    }

    // Create reviews table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        user_id INTEGER,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('Reviews table created or already exists.');

    // Enable RLS on the reviews table
    await client.query('ALTER TABLE reviews ENABLE ROW LEVEL SECURITY');
    console.log('Row-Level Security enabled on reviews table.');

    // Policy for public read access
    await client.query(`
      DROP POLICY IF EXISTS "public_read_access_reviews" ON reviews;
      CREATE POLICY "public_read_access_reviews" ON reviews
      FOR SELECT USING (true)
    `);
    console.log('Public read access policy for reviews created.');

    // Policy for authenticated users to insert reviews
    await client.query(`
      DROP POLICY IF EXISTS "authenticated_insert_reviews" ON reviews;
      CREATE POLICY "authenticated_insert_reviews" ON reviews
      FOR INSERT WITH CHECK (current_setting('app.current_user_id', true) IS NOT NULL)
    `);
    console.log('Authenticated insert policy for reviews created.');

    // Policy for users to update their own reviews
    await client.query(`
      DROP POLICY IF EXISTS "user_update_own_reviews" ON reviews;
      CREATE POLICY "user_update_own_reviews" ON reviews
      FOR UPDATE USING (user_id::text = current_setting('app.current_user_id', true))
    `);
    console.log('User update own reviews policy created.');

    // Policy for users to delete their own reviews
    await client.query(`
      DROP POLICY IF EXISTS "user_delete_own_reviews" ON reviews;
      CREATE POLICY "user_delete_own_reviews" ON reviews
      FOR DELETE USING (user_id::text = current_setting('app.current_user_id', true))
    `);
    console.log('User delete own reviews policy created.');

    // Policy for admins to have full access
    await client.query(`
      DROP POLICY IF EXISTS "admin_all_access_reviews" ON reviews;
      CREATE POLICY "admin_all_access_reviews" ON reviews
      FOR ALL USING (current_setting('app.current_user_role', true) = 'admin')
      WITH CHECK (current_setting('app.current_user_role', true) = 'admin')
    `);
    console.log('Admin all access policy for reviews created.');

    // Check if products are already inserted
    const productCount = await client.query("SELECT count(*) as count FROM products");
    if (parseInt(productCount.rows[0].count, 10) === 0) {
      console.log('No products found, inserting data...');
      const productsPath = path.join(__dirname, 'products.json');
      const data = fs.readFileSync(productsPath, 'utf8');
      const products = JSON.parse(data);

      for (const product of products) {
        await client.query(
          `INSERT INTO products (id, name, description, category, price, originalPrice, image, reviews, rating, isNew) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            product.id,
            product.name,
            product.description || 'Aucune description disponible',
            product.category,
            product.price,
            product.originalPrice,
            product.image,
            product.reviews,
            product.rating,
            product.isNew
          ]
        );
      }
      console.log('Products data inserted.');
    } else {
      console.log('Products data already exists.');
    }

    console.log('Database setup completed successfully.');
  } catch (err) {
    console.error('Error setting up the database:', err.stack);
  } finally {
    await client.release();
    console.log('Database client released.');
    await pool.end();
    console.log('Pool has ended.');
  }
};

setupDatabase();
