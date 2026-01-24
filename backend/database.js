const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool instance to connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export a query function that will be used throughout the application
// to interact with the database.
module.exports = {
  query: (text, params) => pool.query(text, params),
};