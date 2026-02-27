"use client";

import { useState, useEffect } from 'react';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/categories';
import { Star, Filter, Grid, List, ShoppingCart, Heart, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Load cart and wishlist from localStorage
        const savedCart = localStorage.getItem('cart');
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        // Get category data
        const categoryData = getCategoryBySlug(params.slug);
        if (!categoryData) {
          console.error('Category not found');
          return;
        }

        setCategory(categoryData);

        // Get products for this category
        const productsData = getProductsByCategory(params.slug);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [params.slug]);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Save wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const addToWishlist = (product: any) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const filteredAndSortedProducts = products
    .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
    .filter(product => !inStockOnly || product.inStock)
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.reviewCount - a.reviewCount;
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return 0; // All products are treated equally for now
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.nameAr}</span>
          </nav>
        </div>
      </div>

      {/* Category Hero */}
      <div className="relative h-64 bg-gradient-to-r from-green-800 to-emerald-700">
        <Image
          src={category.image}
          alt={category.nameAr}
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{category.nameAr}</h1>
            <p className="text-xl max-w-2xl mx-auto">{category.descriptionAr}</p>
            <p className="mt-2 text-lg">{products.length} منتج متاح</p>
          </div>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 ml-2" />
                فلترة المنتجات
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نطاق السعر
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]} د.م</span>
                    <span>{priceRange[1]} د.م</span>
                  </div>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="ml-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">المنتجات المتوفرة فقط</span>
                </label>
              </div>

              {/* Trust Badges */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">ضماناتنا</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600 ml-2" />
                    منتجات أصلية 100%
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600 ml-2" />
                    شحن سريع
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600 ml-2" />
                    استرجاع خلال 30 يوم
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  عرض {filteredAndSortedProducts.length} من {products.length} منتج
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="popularity">الأكثر شعبية</option>
                    <option value="price_low">السعر: من الأقل إلى الأعلى</option>
                    <option value="price_high">السعر: من الأعلى إلى الأقل</option>
                    <option value="rating">التقييم</option>
                    <option value="newest">الأحدث</option>
                  </select>
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">لا توجد منتجات تطابق معايير البحث</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {filteredAndSortedProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="block">
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200">
                      <div className="relative">
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {product.badge && (
                          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            {product.badge}
                          </span>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                            <span className="text-white font-medium">نفد المخزون</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2 hover:text-green-600 transition-colors">{product.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 mr-2">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-lg font-bold text-gray-900">{product.price} د.م</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-block mr-2">{product.originalPrice} د.م</span>
                            )}
                          </div>
                          {product.inStock && product.stockCount <= 10 && (
                            <span className="text-xs text-orange-600">متبقي {product.stockCount}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            disabled={!product.inStock}
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center"
                          >
                            <ShoppingCart className="w-4 h-4 ml-1" />
                            أضف للسلة
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
                            }}
                            className={`p-2 rounded-md ${isInWishlist(product.id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
