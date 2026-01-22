# BioPara Backend API

Node.js backend API for the BioPara ecommerce platform, built with Express.js and SQLite.

## 🚀 Features

- **RESTful API**: Complete REST API for products, users, and orders
- **Authentication**: JWT-based user authentication
- **Database**: SQLite database with proper schema
- **Security**: Password hashing, CORS, input validation
- **Admin Panel**: Administrative endpoints for product/order management
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── server.js           # Main server file and API routes
├── database.js         # Database setup and queries
├── products.json       # Initial product data
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npm run setup
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on http://localhost:3000

## 📋 Available Scripts

- `npm start` - Start the production server
- `npm run setup` - Initialize database and seed data
- `npm run dev` - Start with nodemon (if installed)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_PATH=./db.sqlite
NODE_ENV=development
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  rating REAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  user_name TEXT,
  user_email TEXT,
  phone TEXT,
  address TEXT,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  items TEXT, -- JSON string of cart items
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Routes
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/admin/orders` - Get all orders (Admin only)
- `PUT /api/admin/orders/:id` - Update order status (Admin only)

### Categories
- `GET /api/categories` - Get all product categories

## 📝 Request/Response Examples

### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Organic Honey",
  "description": "Pure organic honey from Moroccan mountains",
  "price": 45.00,
  "category": "Food",
  "image": "/products/honey.jpg",
  "rating": 4.5
}
```

### Create Order
```http
POST /api/orders
Authorization: Bearer <user-jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+212600000000",
  "address": "123 Main St, Casablanca",
  "cart": [
    {
      "id": 1,
      "name": "Organic Honey",
      "price": "45.00",
      "quantity": 2
    }
  ],
  "total": 90.00
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Configured for frontend origin
- **Input Validation**: Basic validation on API inputs
- **SQL Injection Protection**: Parameterized queries

## 🧪 Testing the API

### Using cURL

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Register user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in environment variables
2. Configure production database path
3. Set strong JWT secret
4. Configure CORS for production domain

### Process Managers
- **PM2**: `pm2 start server.js --name "biopara-api"`
- **Forever**: `forever start server.js`

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include:
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

## 📊 Monitoring

### Health Check
```http
GET /api/health
```

Returns server status and database connection.

## 🤝 Contributing

1. Follow the existing code style
2. Add proper error handling
3. Update documentation for new endpoints
4. Test thoroughly before submitting

## 📄 License

ISC License

## 📞 Support

For API support or issues, contact the development team.
