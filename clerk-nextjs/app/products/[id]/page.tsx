"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, getProductsByCategory, getCategoryBySlug } from '../../../lib/categories';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Star, ShoppingCart, Heart, Check, Truck, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!params.id) return;

        // Get product data
        const productData = getProductBySlug(params.id as string);
        if (!productData) {
          console.error('Product not found');
          return;
        }

        setProduct(productData);

        // Get category data
        const categoryData = getCategoryBySlug(productData.category);
        setCategory(categoryData);

        // Get related products from same category
        const relatedProductsData = getProductsByCategory(productData.category)
          .filter(p => p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(relatedProductsData);

        // Load cart and wishlist from localStorage
        const savedCart = localStorage.getItem('cart');
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = () => {
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const addToWishlist = () => {
    if (!product || wishlist.find(item => item.id === product.id)) return;
    setWishlist([...wishlist, product]);
  };

  const removeFromWishlist = () => {
    if (!product) return;
    setWishlist(wishlist.filter(item => item.id !== product.id));
  };

  const isInWishlist = () => {
    return wishlist.some(item => item.id === product?.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockCount || 10)) {
      setQuantity(newQuantity);
    }
  };

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
          <Link href="/" className="text-green-600 hover:text-green-700">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
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
            <Link href={`/category/${product.category}`} className="hover:text-green-600">
              {category?.nameAr}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.image}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.badge && (
                <span className="absolute top-4 right-4 bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white font-medium text-lg">نفد المخزون</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[product.image].map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviewCount} تقييم)</span>
                <span className="text-green-600 font-medium">متوفر</span>
              </div>
              
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">{product.price} د.م</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{product.originalPrice} د.م</span>
                )}
              </div>

              {/* Product Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['description', 'benefits', 'usage'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-green-600 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'description' && 'الوصف'}
                      {tab === 'benefits' && 'الفوائد'}
                      {tab === 'usage' && 'طريقة الاستخدام'}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}
                
                {activeTab === 'benefits' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 mb-4">الفوائد الرئيسية:</h3>
                    <ul className="space-y-2">
                      {product.tags.map((tag: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-600 ml-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'usage' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">طريقة الاستخدام:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {product.category === 'supplements' && 'تناول كبسولة واحدة يومياً مع وجبة الطعام، أو حسب توجيهات الطبيب.'}
                        {product.category === 'herbs' && 'أضف ملعقة صغيرة إلى كوب ماء ساخن واتركها لمدة 5-10 دقائق قبل الشرب.'}
                        {product.category === 'oils' && 'ضع بضع قطرات على المنطقة المرغوبة وقم بالتدليك بلطف حتى الامتصاص الكامل.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">تفاصيل المنتج:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">الشكل:</span>
                    <span className="text-gray-900 mr-2">
                      {product.category === 'supplements' && 'كبسولات'}
                      {product.category === 'herbs' && 'أعشاب مجففة'}
                      {product.category === 'oils' && 'زيت'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">الكمية:</span>
                    <span className="text-gray-900 mr-2">60 كبسولة</span>
                  </div>
                  <div>
                    <span className="text-gray-500">التخزين:</span>
                    <span className="text-gray-900 mr-2">في مكان بارد وجاف</span>
                  </div>
                  <div>
                    <span className="text-gray-500">العلامة التجارية:</span>
                    <span className="text-gray-900 mr-2">{product.brand}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span className="text-xs text-gray-600">منتج أصلي 100%</span>
                  </div>
                  <div className="text-center">
                    <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span className="text-xs text-gray-600">شحن سريع</span>
                  </div>
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span className="text-xs text-gray-600">استرجاع خلال 30 يوم</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-gray-700 font-medium">الكمية:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-0 focus:ring-0"
                    min="1"
                    max={product.stockCount}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  متوفر {product.stockCount} قطعة
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  أضف للسلة
                </button>
                <button
                  onClick={isInWishlist() ? removeFromWishlist : addToWishlist}
                  className={`p-3 rounded-md ${
                    isInWishlist() ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  } hover:bg-gray-200`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist() ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">منتجات ذات صلة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={(p) => {
                    console.log('Added to cart:', p);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
