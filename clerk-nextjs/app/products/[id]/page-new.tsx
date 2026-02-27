"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, getProductsByCategory, getCategoryBySlug } from '../../../lib/categories';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Star, ShoppingCart, Heart, Check, Truck, Shield, RefreshCw, MessageCircle, ArrowRight, Clock, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../../contexts/CartContext';
import { useToast } from '../../../components/ui/Toast';
import EnhancedProductCard from '../../../components/EnhancedProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();
  const { addToast } = useToast();

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

        // Check if product is in wishlist
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          const wishlist = JSON.parse(savedWishlist);
          setIsWishlisted(wishlist.some((item: any) => item.id === productData.id));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      brand: product.brand,
      inStock: product.inStock
    }, quantity);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);

    addToast({
      type: 'success',
      title: 'تمت الإضافة للسلة',
      message: `${product.title} تمت إضافته بنجاح (${quantity} قطعة)`
    });
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;

    const message = `مرحباً، أود طلب المنتج:\n\n📦 ${product.title}\n💰 السعر: ${product.price} درهم\n📊 الكمية: ${quantity} قطعة\n\n🔗 الرابط: ${window.location.href}\n\nأرجو تأكيد الطلب وتفاصيل الشحن والدفع.`;
    const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const savedWishlist = localStorage.getItem('wishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    if (isWishlisted) {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
      addToast({
        type: 'info',
        title: 'تم الحذف من المفضلة',
        message: `${product.title} تم حذفه من المفضلة`
      });
    } else {
      wishlist.push(product);
      addToast({
        type: 'success',
        title: 'تمت الإضافة للمفضلة',
        message: `${product.title} تمت إضافته للمفضلة`
      });
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockCount || 99)) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose prose-emerald max-w-none">
            <p>{product?.description}</p>
            {product?.longDescription && (
              <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
            )}
          </div>
        );
      case 'benefits':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">الفوائد الرئيسية:</h4>
            <ul className="space-y-2">
              {product?.benefits?.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'usage':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">طريقة الاستخدام:</h4>
            <p>{product?.usageInstructions}</p>
          </div>
        );
      case 'ingredients':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">المكونات:</h4>
            <p>{product?.ingredients}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
          <p className="text-gray-600 mb-8">المنتج الذي تبحث عنه غير متوفر</p>
          <Link
            href="/products"
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            العودة للمنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'الرئيسية', href: '/' },
              { label: 'المنتجات', href: '/products' },
              { label: category?.nameAr || product.category, href: `/products?category=${product.category}` },
              { label: product.title }
            ]}
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96">
                <Image
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.badge && (
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      نفد المخزون
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-emerald-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating || 5)}
                </div>
                <span className="text-gray-600">
                  ({product.reviewCount || 0} تقييم)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-emerald-600">
                {product.price} ر.س
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-lg text-gray-500 line-through">
                  {product.originalPrice} ر.س
                </div>
              )}
              {product.inStock && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">متوفر</span>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>ضمان الجودة</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>توصيل سريع</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>معتمد</span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">الكمية:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-16 text-center border-x border-gray-300 py-2"
                    min="1"
                    max={product.stockCount || 99}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= (product.stockCount || 99)}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stockCount || 0} قطعة متوفرة
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    !product.inStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      تمت الإضافة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      أضف للسلة
                    </>
                  )}
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  اطلب الآن
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200">
              <div className="flex gap-8">
                {['description', 'benefits', 'usage', 'ingredients'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'description' && 'الوصف'}
                    {tab === 'benefits' && 'الفوائد'}
                    {tab === 'usage' && 'طريقة الاستخدام'}
                    {tab === 'ingredients' && 'المكونات'}
                  </button>
                ))}
              </div>
              <div className="py-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">منتجات ذات صلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <EnhancedProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/212600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110 z-50"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
