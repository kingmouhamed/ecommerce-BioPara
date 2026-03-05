"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  Tag, 
  Gift, 
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Truck,
  Shield
} from "lucide-react";

export default function WeeklyOfferPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [copiedCode, setCopiedCode] = useState(false);

  // Weekly offer data
  const weeklyOffer = {
    id: "weekly-2026-w10",
    title: "عرض الأسبوع المميز",
    subtitle: "زيت الأرغان المغربي الأصلي",
    description: "احصل على أفضل جودة من زيت الأرغان المغربي المستخرج بالطرق التقليدية. غني بفيتامين E والأحماض الدهنية الأساسية لبشرة مشرقة وشعر صحي.",
    originalPrice: 299,
    salePrice: 199,
    discount: 33,
    savings: 100,
    code: "WEEKLY33",
    image: "/images/medicinal-oils/argan-oil.jpg",
    category: "زيوت علاجية",
    brand: "BioPara Premium",
    inStock: true,
    rating: 4.8,
    reviews: 234,
    features: [
      "100% طبيعي وخالص",
      "مستخرج بالطرق التقليدية",
      "غني بفيتامين E",
      "مناسب للبشرة والشعر",
      "معتمد من وزارة الصحة"
    ],
    benefits: [
      "ترطيب عميق للبشرة",
      "مكافحة علامات الشيخوخة",
      "تقوية الشعر ومنع التساقط",
      "علاج تشققات الجلد",
      "حماية من أشعة الشمس"
    ],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weeklyOffer.expiresAt.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weeklyOffer.expiresAt]);

  const copyCode = () => {
    navigator.clipboard.writeText(weeklyOffer.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const addToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", weeklyOffer);
  };

  const addToWishlist = () => {
    // Add to wishlist logic here
    console.log("Added to wishlist:", weeklyOffer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">عرض محدود الوقت - ينتهي خلال:</span>
          <div className="flex items-center gap-2 mr-4">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-bold">
              {String(timeLeft.days).padStart(2, '0')} يوم
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-bold">
              {String(timeLeft.hours).padStart(2, '0')} ساعة
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-bold">
              {String(timeLeft.minutes).padStart(2, '0')} دقيقة
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-bold">
              {String(timeLeft.seconds).padStart(2, '0')} ثانية
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
              <Tag className="w-5 h-5" />
              <span className="font-semibold">عرض الأسبوع الحصري</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {weeklyOffer.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {weeklyOffer.subtitle} - خصم {weeklyOffer.discount}% لفترة محدودة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={weeklyOffer.image}
                    alt={weeklyOffer.subtitle}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    -{weeklyOffer.discount}%
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    متوفر
                  </div>
                </div>

                {/* Product Actions */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={addToCart}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    أضف للسلة
                  </button>
                  <button
                    onClick={addToWishlist}
                    className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Price Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-bold text-emerald-600">
                        {weeklyOffer.salePrice} درهم
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        {weeklyOffer.originalPrice} درهم
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                      <Gift className="w-5 h-5" />
                      توفير {weeklyOffer.savings} درهم
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${star <= Math.floor(weeklyOffer.rating) ? 'fill-current text-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {weeklyOffer.rating} ({weeklyOffer.reviews} تقييم)
                    </p>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-emerald-800 mb-1">كود الخصم الحصري</h3>
                      <p className="text-emerald-600 text-sm">استخدم هذا الكود للحصول على الخصم</p>
                    </div>
                    <div className="text-left">
                      <div className="bg-white px-4 py-2 rounded-lg font-mono font-bold text-emerald-700 border border-emerald-300">
                        {weeklyOffer.code}
                      </div>
                      <button
                        onClick={copyCode}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold mt-1"
                      >
                        {copiedCode ? "تم النسخ!" : "نسخ الكود"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="font-semibold">التصنيف:</span>
                    <span>{weeklyOffer.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="font-semibold">العلامة التجارية:</span>
                    <span>{weeklyOffer.brand}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold">معتمد من وزارة الصحة</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">المميزات الرئيسية</h3>
                <div className="grid grid-cols-1 gap-3">
                  {weeklyOffer.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">الفوائد الصحية</h3>
                <div className="grid grid-cols-1 gap-3">
                  {weeklyOffer.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-blue-900">شحن سريع ومجاني</h3>
                </div>
                <p className="text-blue-700 text-sm">
                  توصيل خلال 24-48 ساعة لجميع المدن الرئيسية. شحن مجاني للطلبات فوق 300 درهم.
                </p>
              </div>
            </div>
          </div>

          {/* Related Offers */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">عروض قد تهمك</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "زيت اللافندر",
                  price: 149,
                  originalPrice: 199,
                  discount: 25,
                  image: "/images/medicinal-oils/lavender-oil.jpg"
                },
                {
                  title: "عسل النحل الأصلي",
                  price: 89,
                  originalPrice: 129,
                  discount: 31,
                  image: "/images/categories/honey.jpg"
                },
                {
                  title: "زيت الزيتون البكر",
                  price: 179,
                  originalPrice: 249,
                  discount: 28,
                  image: "/images/medicinal-oils/olive-oil.jpg"
                }
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{product.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-emerald-600">{product.price} درهم</span>
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice} درهم</span>
                    </div>
                    <Link 
                      href={`/products`}
                      className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 text-sm"
                    >
                      عرض المنتج
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
