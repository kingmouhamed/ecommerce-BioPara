# BioPara Ecommerce Platform

A modern ecommerce application built with Next.js 14, React 18, Tailwind CSS, and Clerk authentication for selling natural and organic parapharmacy products.

## 🚀 Features

- **Modern Frontend**: Next.js 14 with React 18, Tailwind CSS, and responsive design
- **User Authentication**: Clerk-based authentication system
- **Product Management**: Complete CRUD operations for products
- **Shopping Cart**: Persistent cart with local storage
- **Multi-language**: French/Arabic support with RTL
- **SEO Optimized**: Next.js built-in SEO optimizations
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **Lucide React** - Beautiful icons
- **TypeScript** - Type safety

### Additional Libraries
- **Material-UI** - React components
- **Supabase** - Database and backend services
- **Swiper** - Carousel/slider components
- **React Helmet Async** - Document head management

## 📁 Project Structure

```
/
├── clerk-nextjs/             # Next.js application
│   ├── app/                 # App Router pages and layouts
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utility functions
│   ├── public/              # Public static files
│   └── package.json
├── package.json             # Root package.json with scripts
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
   cd ecommerce-biopara
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   # or
   cd clerk-nextjs && npm install
   ```

3. **Setup environment variables**
   ```bash
   cd clerk-nextjs
   cp .env.local.example .env.local
   # Edit .env.local with your Clerk credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   cd clerk-nextjs && npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run install-deps` - Install dependencies

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the `clerk-nextjs` directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 🗄️ Database

The application uses Supabase for data persistence. The database schema includes:
- **Users**: User accounts managed by Clerk
- **Products**: Product catalog with categories
- **Orders**: Order management and tracking
- **Categories**: Product categorization

## 🔐 Authentication

- Clerk handles user authentication and session management
- Protected routes for user-specific functionality
- User registration and login through Clerk components
- Social login providers supported

## 🎨 UI Components

### Key Components
- **Cart**: Shopping cart with quantity management
- **ProductCard**: Product display card
- **Header**: Navigation with cart and user menu
- **Footer**: Site information and links
- **Carousel**: Product showcase slider

### Styling
- **Tailwind CSS**: Utility-first styling
- **Material-UI**: Additional React components
- **Responsive Design**: Mobile-first approach
- **RTL Support**: Arabic language support

## 📱 Pages

- **Home**: Landing page with featured products
- **Products**: Product catalog with filtering
- **Cart**: Shopping cart management
- **Checkout**: Order completion process
- **Login/Signup**: User authentication
- **About**: Company information
- **Contact**: Contact information
- **Favorites**: User wishlist

## 🧪 Testing

```bash
cd clerk-nextjs
npm run test
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy on Vercel
The easiest way to deploy is using the Vercel Platform from the creators of Next.js.

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
