"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Leaf, ShoppingCart, ChevronLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProduct, products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProduct(params.id as string);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItemCount } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            المنتج غير موجود
          </h1>
          <p className="text-gray-600 mb-6">المنتج الذي تبحث عنه غير موجود</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            العودة للمنتجات
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image_url,
      },
      quantity
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              BioPara
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">المنتجات</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">اتصل بنا</Link>
            </nav>
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <Link
              href="/products"
              className="hover:text-primary-600 transition-colors"
            >
              المنتجات
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.rating >= 4.5 && (
              <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                مميز
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-500">
                    ({product.review_count} تقييم)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-600">
                {product.price} درهم
              </span>
              {product.stock_quantity < 10 && (
                <span className="text-red-600 text-sm">
                  {"متبقي"} {product.stock_quantity} {"قطع فقط"}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">الوصف</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">الفوائد</h3>
                <ul className="flex flex-col gap-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.usage_instructions && (
              <div>
                <h3 className="font-semibold text-lg mb-2">طريقة الاستخدام</h3>
                <p className="text-gray-600">{product.usage_instructions}</p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="font-semibold text-lg mb-2">المكونات</h3>
                <p className="text-gray-600">{product.ingredients}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col gap-4">
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
                    onClick={() =>
                      setQuantity(
                        Math.min(product.stock_quantity, quantity + 1)
                      )
                    }
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                أضف إلى السلة
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              منتجات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
