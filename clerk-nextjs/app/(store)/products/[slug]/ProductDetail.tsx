'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/data/products'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'
import RelatedProducts from '@/components/sections/RelatedProducts'
import WhatsAppOrderButton from '@/components/actions/WhatsAppOrderButton'
import { Star, Heart, ShoppingCart, MessageCircle, Facebook, Link as LinkIcon } from 'lucide-react'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const { addToCart } = useCart()
  const { addToast } = useToast()

  const imageUrl = product.images?.[selectedImage] || product.image_url || '/images/products/product-placeholder.jpg'
  const categoryName = product.categories?.name_ar || product.categories?.name || 'غير مصنف'

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.name_ar || product.name,
      price: product.price,
      image: (product.images && product.images.length > 0) ? product.images[0] : product.image_url || '/images/products/product-placeholder.jpg',
      brand: 'BioPara',
      inStock: product.stock > 0,
      slug: product.slug
    }, quantity)

    addToast({
      type: 'success',
      title: 'تمت الإضافة للسلة',
      message: `${product.name_ar || product.name} تمت إضافته بنجاح`
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleBuyNow = () => {
    const phoneNumber = "212673020264";
    const message = `✨ أود طلب هذا المنتج فوراً ✨\n\n*المنتج:* ${product.name_ar || product.name}\n*الكمية:* ${quantity}\n*السعر الإجمالي:* ${(product.price * quantity).toFixed(2)} درهم\n\nالمرجو تأكيد الطلب.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      addToast({ type: 'success', title: 'تم النسخ', message: 'تم نسخ رابط المنتج بنجاح' });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-0" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 space-x-reverse">
            <li>
              <Link href="/" className="text-gray-500 hover:text-emerald-700 font-medium transition-colors">
                الرئيسية
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-emerald-700 font-medium transition-colors">
                المنتجات
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-emerald-800 font-bold">
              {product.name_ar || product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">

          {/* Product Images Details (Left on LTR, Right on RTL) */}
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50 shadow-inner relative border border-gray-100">
              <Image
                src={imageUrl}
                alt={product.name_ar || product.name}
                fill
                className="w-full h-full object-cover mix-blend-multiply"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    title={`صورة المنتج ${index + 1}`}
                    className={`aspect-square relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${selectedImage === index
                      ? 'border-emerald-500 shadow-md transform -translate-y-1'
                      : 'border-gray-100 hover:border-emerald-300 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name_ar || product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info (Right on LTR, Left on RTL) */}
          <div className="space-y-8 flex flex-col justify-center">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 tracking-wide">
                {categoryName}
              </span>
              {product.featured && (
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 tracking-wide">
                  منتج مميز
                </span>
              )}
            </div>

            {/* Heading & Wishlist */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
                  {product.name_ar || product.name}
                </h1>

                {/* Social Proof: Star Rating */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-500 underline cursor-pointer hover:text-emerald-600 transition-colors">
                    (24 تقييم)
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToast({ type: 'success', title: 'تمت الإضافة للمفضلة', message: 'تم حفظ المنتج في قائمتك' });
                }}
                className="p-3.5 bg-gray-50 border border-gray-100 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shrink-0 shadow-sm group"
                aria-label="أضف للمفضلة"
              >
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Short Description */}
            {product.short_description_ar && (
              <p className="text-gray-600 font-medium text-base/7 md:text-lg/8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {product.short_description_ar}
              </p>
            )}

            {/* Price & Stock status */}
            <div>
              <div className="flex items-baseline space-x-2 space-x-reverse mb-3">
                <span className="text-4xl md:text-5xl font-black text-emerald-600">
                  {product.price.toFixed(2)}
                </span>
                <span className="text-xl md:text-2xl font-bold text-gray-500">
                  {product.currency}
                </span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                {product.stock > 0 ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-green-700 font-bold text-sm">
                      متوفر في المخزون ({product.stock} قطعة)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                    <span className="text-red-700 font-bold text-sm">
                      نفد المخزون
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-5">

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <label htmlFor="quantity" className="text-sm font-bold text-gray-800">
                  الكمية المطلوبة:
                </label>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock}
                    className="w-16 text-center border-0 focus:ring-0 font-bold text-gray-900 bg-transparent p-0"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Main Buttons */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-white p-4 border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] lg:relative lg:p-0 lg:border-0 lg:shadow-none lg:bg-transparent lg:z-auto flex flex-col sm:flex-row gap-3">
                <div className="flex-1 w-full">
                  <WhatsAppOrderButton
                    productName={product.name_ar || product.name}
                    productPrice={product.price}
                    productSlug={product.slug}
                    quantity={quantity}
                    variant="primary"
                    customClass={product.stock === 0 ? "pointer-events-none opacity-50 grayscale" : ""}
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`py-4 px-6 rounded-xl font-bold transition-all shadow-sm border flex items-center justify-center gap-2 ${product.stock === 0
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-950 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>أضف للسلة</span>
                </button>
              </div>

              {/* Trust/Secure Message */}
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                <span>دفع آمن عند الاستلام وتوصيل سريع</span>
              </div>

              {/* Estimated Delivery Date */}
              <div className="bg-emerald-50/80 rounded-xl p-4 flex items-start gap-3 border border-emerald-100/50">
                <TruckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-800">التوصيل المتوقع</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {(() => {
                      const today = new Date();
                      const minDate = new Date(today);
                      minDate.setDate(today.getDate() + 2);
                      const maxDate = new Date(today);
                      maxDate.setDate(today.getDate() + 4);
                      
                      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
                      return `بين ${minDate.toLocaleDateString('ar-MA', options)} و ${maxDate.toLocaleDateString('ar-MA', options)}`;
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm font-bold text-gray-700">شارك المنتج:</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors border border-green-100" title="مشاركة عبر واتساب">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-100" title="مشاركة عبر فيسبوك">
                  <Facebook className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare('link')} className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors border border-gray-200" title="نسخ الرابط">
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Basic Meta Info Cleanup */}
            <div className="flex items-center gap-6 mt-4 opacity-70">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">العلامة التجارية:</span>
                <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">BioPara</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">رمز المنتج (SKU):</span>
                <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{product.slug}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Product Details Content Architecture (Tabs) */}
        <div className="mt-14 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100 hide-scrollbar" role="tablist">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-5 px-8 text-base font-bold whitespace-nowrap transition-colors flex-1 text-center relative ${activeTab === 'description' ? 'text-emerald-700 bg-emerald-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              role="tab"
            >
              وصف المنتج
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-lg"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`py-5 px-8 text-base font-bold whitespace-nowrap transition-colors flex-1 text-center relative ${activeTab === 'ingredients' ? 'text-emerald-700 bg-emerald-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              role="tab"
            >
              المكونات
              {activeTab === 'ingredients' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-lg"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`py-5 px-8 text-base font-bold whitespace-nowrap transition-colors flex-1 text-center relative ${activeTab === 'usage' ? 'text-emerald-700 bg-emerald-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              role="tab"
            >
              طريقة الاستخدام
              {activeTab === 'usage' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-lg"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('warnings')}
              className={`py-5 px-8 text-base font-bold whitespace-nowrap transition-colors flex-1 text-center relative ${activeTab === 'warnings' ? 'text-red-700 bg-red-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              role="tab"
            >
              تحذيرات الاستخدام
              {activeTab === 'warnings' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-t-lg"></div>
              )}
            </button>
          </div>

          <div className="p-8 md:p-12 min-h-[250px] bg-white">
            <div className="max-w-4xl mx-auto prose prose-emerald prose-lg text-gray-700 font-medium leading-loose">
              {activeTab === 'description' && (
                <div className="whitespace-pre-line">
                  {product.description_ar || product.description || 'لم يتم توفير وصف تفصيلي لهذا المنتج بعد.'}
                </div>
              )}
              {activeTab === 'ingredients' && (
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                  <h4 className="text-emerald-800 font-bold mb-4">تركيبة طبيعية 100%</h4>
                  <ul className="list-disc list-inside space-y-2 marker:text-emerald-500">
                    {/* Placeholder for real ingredients */}
                    <li>مكونات طبيعية نقية خالية من المواد الحافظة.</li>
                    <li>يحتوي على مستخلصات عشبية وزيوت أساسية داعمة.</li>
                    <li>للمزيد من التفاصيل حول المكونات الدقيقة، يرجى مراجعة العبوة الأصلية.</li>
                  </ul>
                </div>
              )}
              {activeTab === 'usage' && (
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="text-blue-800 font-bold mb-4">إرشادات الاستعمال</h4>
                  <p>للحصول على أفضل النتائج، يُنصح باتباع الخطوات التالية:</p>
                  <ul className="list-decimal list-inside space-y-2 mt-3 marker:text-blue-500">
                    <li>تأكد من قراءة التعليمات المرفقة مع المنتج قبل الاستخدام.</li>
                    <li>استخدم الجرعة الموصى بها ولا تتجاوزها.</li>
                    <li>في حالة الزيوت أو الكريمات، قم بتجربتها على منطقة صغيرة من الجلد أولاً.</li>
                  </ul>
                </div>
              )}
              {activeTab === 'warnings' && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <h4 className="text-red-800 font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> تنبيه هام
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-red-900 marker:text-red-500">
                    <li>يُحفظ بعيداً عن متناول الأطفال.</li>
                    <li>لا يُستخدم أثناء الحمل أو الرضاعة دون استشارة طبية.</li>
                    <li>إذا كنت تعاني من أمراض مزمنة أو تتناول أدوية، استشر طبيبك قبل الاستخدام.</li>
                    <li>هذا المنتج غير مخصص لتشخيص، علاج، أو منع أي مرض.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Related Products Section */}
      <div className="w-full bg-white mt-8 border-t border-gray-100">
        <RelatedProducts
          currentProductId={String(product.id)}
          categorySlug={product.categories?.slug}
        />
      </div>
    </div>
  )
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function TruckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
      <path d="M14 17h1" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}
