require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
// More secure CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://localhost:5176'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));
app.use(express.json());
const port = 3001;
const JWT_SECRET = process.env.JWT_SECRET;


// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

// Products endpoint
app.get('/api/products', async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
  
    let sql = `SELECT * FROM products`;
    let countSql = `SELECT COUNT(*) as count FROM products`;
    const params = [];
    let paramIndex = 1;

    if (category) {
      sql += ` WHERE category = $${paramIndex}`;
      countSql += ` WHERE category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
  
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
  
    try {
        const countResult = await db.query(countSql, params.slice(0, params.length - 2));
        const countRow = countResult.rows[0];

        const result = await db.query(sql, params);
        const rows = result.rows;

        res.json({
            data: rows,
            totalPages: Math.ceil(countRow.count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM products WHERE id = $1`;
    try {
        const result = await db.query(sql, [id]);
        const row = result.rows[0];
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new product (Admin only)
app.post('/api/products', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, category, image, rating } = req.body;
  if (!name || !price || !category || !image || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const sql = `INSERT INTO products (name, description, price, category, image, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
  try {
    const result = await db.query(sql, [name, description, price, category, image, rating]);
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product (Admin only)
app.put('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, category, image, rating } = req.body;
  const { id } = req.params;
  const sql = `UPDATE products SET name = $1, description = $2, price = $3, category = $4, image = $5, rating = $6 WHERE id = $7`;
  try {
    const result = await db.query(sql, [name, description, price, category, image, rating, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product (Admin only)
app.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM products WHERE id = $1`;
  try {
    const result = await db.query(sql, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`;
    await db.query(sql, [name, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = `SELECT * FROM users WHERE email = $1`;
  try {
    const result = await db.query(sql, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order endpoints

// Get order history for the logged-in user
app.get('/api/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const sql = `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`;

  try {
    const result = await db.query(sql, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, total, delivery_info } = req.body;
  const user_id = req.user.id;

  if (!items || !total || !delivery_info) {
    return res.status(400).json({ error: 'Missing required order information.' });
  }

  const sql = `INSERT INTO orders (user_id, items, total, delivery_info) VALUES ($1, $2, $3, $4) RETURNING id`;
  try {
    const result = await db.query(sql, [user_id, JSON.stringify(items), total, JSON.stringify(delivery_info)]);
    res.status(201).json({ id: result.rows[0].id, message: 'Order created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Admin: Get all orders
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  const sql = `
    SELECT o.*, u.name as user_name 
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update order status
app.put('/api/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const sql = `UPDATE orders SET status = $1 WHERE id = $2`;

  try {
    const result = await db.query(sql, [status, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});