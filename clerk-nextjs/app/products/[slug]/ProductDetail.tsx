'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/data/products'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'
import RelatedProducts from '@/components/sections/RelatedProducts'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addToast } = useToast()

  const imageUrl = product.images?.[selectedImage] || product.image_url || '/images/placeholder.jpg'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 space-x-reverse">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                الرئيسية
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                المنتجات
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">
              {product.name_ar || product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <Image
                src={imageUrl}
                alt={product.name_ar || product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    title={`صورة المنتج ${index + 1}`}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name_ar || product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {categoryName}
              </span>
              {product.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mr-2">
                  مميز
                </span>
              )}
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name_ar || product.name}
              </h1>
              {product.short_description_ar && (
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
                  {product.short_description_ar}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2 space-x-reverse">
              <span className="text-4xl font-bold text-gray-900">
                {product.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500">
                {product.currency}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 space-x-reverse">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    متوفر في المخزون ({product.stock} قطعة)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">
                    نفد المخزون
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-green-400"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                وصف المنتج
              </h3>
              <div className="text-gray-700 leading-loose whitespace-pre-line text-base/8 font-medium">
                {product.description_ar || product.description}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  الكمية:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-16 text-center border-0 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
              >
                {product.stock === 0 ? 'نفد المخزون' : 'أضف للسلة'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                معلومات إضافية
              </h3>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">رمز المنتج</dt>
                  <dd className="text-sm text-gray-900">{product.slug}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">العملة</dt>
                  <dd className="text-sm text-gray-900">{product.currency}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">تاريخ الإضافة</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(product.created_at).toLocaleDateString('ar-MA')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        currentProductId={String(product.id)}
        categorySlug={product.categories?.slug}
      />
    </div>
  )
}
