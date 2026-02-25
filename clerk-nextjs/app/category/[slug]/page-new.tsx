"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Filter, ChevronDown, Heart, Eye } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategory, getFeaturedProducts, Product } from '../../../lib/categories';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load category and products
    const categoryData = getCategoryBySlug(params.slug);
    if (categoryData) {
      setCategory(categoryData);
      const categoryProducts = getProductsByCategory(params.slug);
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
    }
    setLoading(false);
  }, [params.slug]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy, priceRange, inStockOnly]);

  const addToCart = (product: Product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        existingCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      alert('تمت إضافة المنتج إلى سلة التسوق!');
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert('فشل إضافة المنتج إلى سلة التسوق');
    }
  };

  const addToWishlist = (product: Product) => {
    try {
      const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (!existingWishlist.find((item: any) => item.id === product.id)) {
        existingWishlist.push({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          rating: product.rating
        });
        localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
        alert('تمت إضافة المنتج إلى المفضلة!');
      } else {
        alert('المنتج موجود بالفعل في المفضلة');
      }
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      alert('فشل إضافة المنتج إلى المفضلة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">الفئة غير موجودة</h1>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.nameAr}</h1>
              <p className="text-gray-600">{category.descriptionAr}</p>
              <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} منتج</p>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                فلاتر
              </button>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="popularity">الأكثر شعبية</option>
                  <option value="price-low">السعر: من الأقل إلى الأعلى</option>
                  <option value="price-high">السعر: من الأعلى إلى الأقل</option>
                  <option value="rating">التقييم</option>
                  <option value="newest">الأحدث</option>
                </select>
                <ChevronDown className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">الفلاتر</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">نطاق السعر</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">الحد الأدنى</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">الحد الأعلى</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">المتوفر فقط</span>
                </label>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t">
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span>منتجات أصلية 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span>ضمان الجودة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span>شحن آمن</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
                <p className="text-gray-600">لم يتم العثور على منتجات تطابق الفلاتر المحددة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Badges */}
                      {product.badge && (
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                          {product.badge}
                        </div>
                      )}
                      
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            غير متوفر
                          </span>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="absolute top-2 left-2 flex flex-col gap-2">
                        <button
                          onClick={() => addToWishlist(product)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition"
                          aria-label="إضافة للمفضلة"
                        >
                          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                        </button>
                        <Link
                          href={`/products/${product.slug}`}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-50 transition"
                          aria-label="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4 text-gray-600 hover:text-emerald-500" />
                        </Link>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700 font-bold text-lg">{product.price.toFixed(2)} درهم</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {product.originalPrice.toFixed(2)} درهم
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Indicator */}
                      {product.inStock && product.stockCount && product.stockCount <= 10 && (
                        <div className="text-xs text-orange-600 mb-2">
                          فقط {product.stockCount} قطع متبقية
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-emerald-700 text-white py-2 rounded-lg font-medium hover:bg-emerald-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition">
                  تحميل المزيد من المنتجات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
