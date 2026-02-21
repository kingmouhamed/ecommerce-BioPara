"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase, Tables } from '../../../lib/supabase-client';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Star } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Tables['products'] | null>(null);
  const [category, setCategory] = useState<Tables['categories'] | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Tables['products'][]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!params.id) return;

        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (productError) {
          console.error('Error fetching product:', productError);
          return;
        }

        setProduct(productData);

        // Fetch category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', productData.category_id)
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
        } else {
          setCategory(categoryData);
        }

        // Fetch related products (same category, different product)
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', productData.category_id)
          .eq('is_active', true)
          .neq('id', params.id)
          .limit(4);

        if (relatedError) {
          console.error('Error fetching related products:', relatedError);
        } else {
          setRelatedProducts(relatedData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
          <p className="text-gray-600">المنتج الذي تبحث عنه غير موجود</p>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...product.images];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'الرئيسية', href: '/' },
              { label: 'المنتجات', href: '/products' },
              { label: category?.name || 'المنتج', href: `/category/${category?.slug}` },
              { label: product.name, href: `/products/${product.id}` }
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
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <Image
                src={allImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.rating >= 4.5 && (
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  مميز
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-emerald-600' : 'border-gray-200'
                    }`}
                    aria-label={`عرض الصورة ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-500">({product.review_count} تقييم)</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{category?.name}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-600">{product.price} درهم</span>
              {product.stock_quantity < 10 && (
                <span className="text-red-600 text-sm">متبقي {product.stock_quantity} قطع فقط</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">الوصف</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              {product.long_description && (
                <p className="text-gray-600 leading-relaxed mt-3">{product.long_description}</p>
              )}
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">الفوائد</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Usage Instructions */}
            {product.usage_instructions && (
              <div>
                <h3 className="font-semibold text-lg mb-2">طريقة الاستخدام</h3>
                <p className="text-gray-600">{product.usage_instructions}</p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div>
                <h3 className="font-semibold text-lg mb-2">المكونات</h3>
                <p className="text-gray-600">{product.ingredients}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">الكمية:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // Will implement cart functionality
                    console.log('Added to cart:', { ...product, quantity });
                  }}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  أضف إلى السلة
                </button>
                <button 
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="إضافة للمفضلة"
                >
                  <Star className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* SKU */}
            {product.sku && (
              <div className="text-sm text-gray-500">
                SKU: {product.sku}
              </div>
            )}
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
