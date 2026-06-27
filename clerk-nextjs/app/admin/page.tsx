"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Package, X, AlertCircle, 
  Upload, Image as ImageIcon, Loader2, Check, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ui/Toast';
import { Product, Category } from '@/lib/data/products';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDescriptionAr, setFormDescriptionAr] = useState('');
  const [formPrice, setFormPrice] = useState('0');
  const [formStock, setFormStock] = useState('0');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addToast } = useToast();

  // Fetch initial data
  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
        setFilteredProducts(data.data.products);
        setCategories(data.data.categories);
      } else {
        addToast({
          type: 'error',
          title: 'خطأ في جلب البيانات',
          message: data.error || 'حدث خطأ غير متوقع'
        });
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      addToast({
        type: 'error',
        title: 'خطأ اتصال',
        message: 'تعذر الاتصال بالخادم لجلب البيانات'
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter products when search query or category filter changes
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name_ar.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categories?.slug === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  // Reset form fields to defaults
  const resetForm = () => {
    setFormName('');
    setFormNameAr('');
    setFormDescription('');
    setFormDescriptionAr('');
    setFormPrice('0');
    setFormStock('0');
    setFormCategoryId('');
    setFormImages([]);
    setFormIsActive(true);
    setFormFeatured(false);
    setUploadError(null);
  };

  // Open modal to create a new product
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal to edit an existing product
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name || '');
    setFormNameAr(product.name_ar || '');
    setFormDescription(product.description || '');
    setFormDescriptionAr(product.description_ar || '');
    setFormPrice(String(product.price ?? 0));
    setFormStock(String(product.stock ?? product.stock_quantity ?? 0));
    setFormCategoryId(String(product.category_id ?? product.categories?.id ?? ''));
    setFormImages(product.images || []);
    setFormIsActive(product.is_active !== false);
    setFormFeatured(Boolean(product.featured || product.is_featured));
    setUploadError(null);
    setIsModalOpen(true);
  };

  // Create or update a product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formName,
        name_ar: formNameAr || formName,
        description: formDescription,
        description_ar: formDescriptionAr || formDescription,
        price: parseFloat(formPrice),
        stock: parseInt(formStock, 10),
        category_id: parseInt(formCategoryId, 10),
        images: formImages,
        is_active: formIsActive,
        featured: formFeatured
      };

      const url = editingProduct 
        ? `/api/products/${editingProduct.id}` 
        : `/api/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          title: editingProduct ? 'تم التحديث' : 'تم الحفظ',
          message: editingProduct ? 'تم تحديث بيانات المنتج بنجاح' : 'تم إضافة المنتج الجديد بنجاح'
        });
        setIsModalOpen(false);
        fetchData(); // Refresh list
      } else {
        addToast({
          type: 'error',
          title: 'خطأ أثناء الحفظ',
          message: data.error || 'فشلت العملية'
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'خطأ',
        message: 'حدث خطأ أثناء الاتصال بالخادم'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Product Deletion
  const handleDeleteProduct = async (productId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
          addToast({
            type: 'success',
            title: 'تم الحذف',
            message: 'تم حذف المنتج بنجاح من قاعدة البيانات'
          });
          setProducts(products.filter(p => p.id !== productId));
        } else {
          addToast({
            type: 'error',
            title: 'فشل الحذف',
            message: data.error || 'لا يمكن حذف هذا المنتج حالياً'
          });
        }
      } catch (err) {
        console.error(err);
        addToast({
          type: 'error',
          title: 'خطأ اتصال',
          message: 'تعذر الاتصال بالخادم لحذف المنتج'
        });
      }
    }
  };

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct frontend validation before upload
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم الملف كبير جداً (الأقصى 5 ميجابايت)');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Add new Cloudinary URL to images array
        setFormImages([...formImages, data.url]);
        addToast({
          type: 'success',
          title: 'تم الرفع',
          message: 'تم رفع الصورة بنجاح إلى Cloudinary'
        });
      } else {
        setUploadError(data.error || 'فشل رفع الصورة');
        addToast({
          type: 'error',
          title: 'خطأ رفع',
          message: data.error || 'حدث خطأ أثناء رفع الصورة'
        });
      }
    } catch (err) {
      console.error(err);
      setUploadError('حدث خطأ في الاتصال أثناء رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove Image from Current List
  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages(formImages.filter((_, idx) => idx !== indexToRemove));
  };

  const getProductImage = (images: string[] | null) => {
    if (images && images.length > 0) return images[0];
    return '/images/products/product-placeholder.jpg';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">لوحة التحكم</h1>
              <p className="text-xs text-slate-400">إدارة المنتجات والمخزون</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <button 
              onClick={handleOpenCreateModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm shadow-emerald-600/10 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
            <Link 
              href="/" 
              className="text-slate-600 hover:text-slate-800 text-sm font-medium border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition"
            >
              العودة للمتجر
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث بالاسم (عربي / English)..."
                className="w-full pr-10 pl-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
              />
            </div>
            <select
              title="تصفية حسب الفئة"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-slate-600"
            >
              <option value="">جميع الفئات</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name_ar || c.name}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            عدد المنتجات المعروضة: <span className="font-semibold text-slate-700">{filteredProducts.length}</span>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-sm text-slate-400">جاري تحميل المنتجات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm">لا توجد منتجات مطابقة لخيارات البحث</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">المنتج</th>
                    <th className="px-6 py-4">الفئة</th>
                    <th className="px-6 py-4">السعر</th>
                    <th className="px-6 py-4">المخزون</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="relative w-11 h-11 bg-slate-100 rounded-lg border overflow-hidden flex-shrink-0">
                            <Image 
                              src={getProductImage(product.images)} 
                              alt={product.name} 
                              fill 
                              sizes="44px"
                              className="object-cover" 
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-700">{product.name_ar || product.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {product.categories?.name_ar || product.categories?.name || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {product.price.toFixed(2)} د.م
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${(product.stock ?? product.stock_quantity ?? 0) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {product.stock ?? product.stock_quantity ?? 0} قطعة
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.is_active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {product.is_active !== false ? 'نشط' : 'مسودة'}
                        </span>
                        {!!(product.featured || product.is_featured) && (
                          <span className="mr-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                            مميز
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2 space-x-reverse text-left">
                        <button 
                          onClick={() => handleOpenEditModal(product)}
                          title="تعديل" 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition inline-block"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(Number(product.id))} 
                          title="حذف" 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition inline-block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-700">
                {editingProduct ? 'تعديل المنتج الحالي' : 'إضافة منتج جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Product Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">اسم المنتج (بالعربية) *</label>
                  <input
                    type="text"
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    required
                    placeholder="مثال: شاي البابونج الطبيعي"
                    className="w-full px-3.5 py-2 text-sm border border-slate-250 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">اسم المنتج (English) *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="Example: Organic Chamomile Tea"
                    className="w-full px-3.5 py-2 text-sm border border-slate-250 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Price, Stock, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">السعر بالدرهم (MAD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-250 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">الكمية المتوفرة بالمخزون</label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-250 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">الفئة الرئيسية *</label>
                  <select
                    title="اختر الفئة"
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-250 rounded-lg focus:border-emerald-500 focus:outline-none bg-white transition"
                  >
                    <option value="" disabled>اختر الفئة</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_ar || c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">الوصف بالعربية</label>
                  <textarea
                    rows={3}
                    value={formDescriptionAr}
                    onChange={(e) => setFormDescriptionAr(e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً للمنتج باللغة العربية..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-250 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">الوصف بالإنجليزية (English)</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter detailed English description of the product..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-250 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Cloudinary Image Upload System */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600">صور المنتج (سيرفر Cloudinary)</label>
                
                {/* Image Previews */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 border rounded-lg">
                    {formImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square bg-white border rounded-lg overflow-hidden group">
                        <Image src={imgUrl} alt="Product Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 hover:scale-105 transition shadow-sm"
                          title="حذف الصورة"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <a 
                          href={imgUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute bottom-1 left-1 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition"
                          title="عرض الصورة الأصلية"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-250 hover:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/20 rounded-xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 group relative"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                      <span className="text-xs text-slate-500">جاري رفع الصورة إلى Cloudinary...</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-white rounded-full border shadow-sm group-hover:scale-110 transition duration-300 text-slate-400 group-hover:text-emerald-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-600">اضغط لرفع صورة جديدة</p>
                        <p className="text-xs text-slate-400">تدعم صيغ PNG, JPG, WEBP حتى حجم 5 ميجابايت</p>
                      </div>
                    </>
                  )}
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Status and Flags */}
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-opacity-25"
                  />
                  <span className="text-sm font-semibold text-slate-700">تفعيل المنتج (عرض للمشترين)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-opacity-25"
                  />
                  <span className="text-sm font-semibold text-slate-700">تمييز المنتج (في الصفحة الرئيسية)</span>
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-5 py-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>حفظ البيانات</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
