# BioPara Ecommerce Platform

A full-stack ecommerce application built with React, Vite, Tailwind CSS, and Node.js for selling natural and organic products.

## 🚀 Features

- **Modern Frontend**: React 19 with Vite, Tailwind CSS, and responsive design
- **Backend API**: Node.js with Express and SQLite database
- **User Authentication**: JWT-based authentication system
- **Product Management**: Complete CRUD operations for products
- **Shopping Cart**: Persistent cart with local storage
- **Admin Panel**: Product and order management dashboard
- **Payment Integration**: PayPal and Stripe payment gateways
- **Multi-language**: Arabic/RTL support
- **SEO Optimized**: React Helmet for meta tags
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Helmet Async** - Document head management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   └── assets/          # Static assets
│   ├── public/              # Public static files
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── server.js            # Main server file
│   ├── database.js          # Database setup and queries
│   ├── products.json        # Product data
│   └── package.json
├── package.json              # Root package.json with scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-biomarket
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup the database**
   ```bash
   npm run setup
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:3000) servers concurrently.

### Alternative: Run separately

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm start
```

## 📋 Available Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run start` - Start the backend server
- `npm run setup` - Initialize the database

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts
- `npm start` - Start the server
- `npm run setup` - Setup database

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_PATH=./db.sqlite
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000
```

## 🗄️ Database

The application uses SQLite for data persistence. The database schema includes:

- **Users**: User accounts and authentication
- **Products**: Product catalog with categories
- **Orders**: Order management and tracking
- **Categories**: Product categorization

## 🔐 Authentication

- JWT tokens for session management
- Password hashing with bcrypt
- Protected routes for admin functionality
- User registration and login

## 💳 Payment Integration

- **PayPal**: PayPal React SDK integration
- **Stripe**: Stripe Elements for secure payments
- Support for multiple currencies

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/admin/orders` - Get all orders (Admin)

## 🎨 UI Components

### Key Components
- **Cart**: Shopping cart with quantity management
- **ProductCard**: Product display card
- **Categories**: Product category navigation
- **Hero**: Landing page hero section
- **Admin Panel**: Product and order management

### Styling
- **Tailwind CSS**: Utility-first styling
- **Custom CSS**: Additional component styles
- **Responsive Design**: Mobile-first approach
- **RTL Support**: Arabic language support

## 📱 Pages

- **Home**: Landing page with featured products
- **Products**: Product catalog with filtering
- **Product Detail**: Individual product view
- **Cart**: Shopping cart management
- **Checkout**: Order completion process
- **Login/Register**: User authentication
- **Admin**: Administrative dashboard
- **About**: Company information
- **Contact**: Contact information

## 🔍 SEO & Performance

- **React Helmet**: Dynamic meta tags
- **Lazy Loading**: Component code splitting
- **Image Optimization**: Optimized product images
- **Caching**: Efficient data caching

## 🧪 Testing

```bash
# Frontend testing
cd frontend
npm run test

# Backend testing (if implemented)
cd backend
npm test
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Configure your server (Heroku, Vercel, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email info@biopara.ma or contact us through the website.

## 🙏 Acknowledgments

- React and Vite communities
- Open source contributors
- Moroccan natural product suppliers
