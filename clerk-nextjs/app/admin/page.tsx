"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, TrendingUp, Users, ShoppingCart, Grid, List, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ui/Toast';
import { Product, Category } from '@/lib/data/products';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { addToast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.products);
          setFilteredProducts(data.data.products);
          setCategories(data.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      // API call to delete to be implemented
      setProducts(products.filter(p => p.id !== productId));
      addToast({
        type: 'success',
        title: 'تم الحذف',
        message: 'تم الحذف بنجاح (Simulation)'
      });
    }
  };

  const getProductImage = (images: string[] | null) => {
    if (images && images.length > 0) return images[0];
    return '/images/products/product-placeholder.jpg';
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
            <span className="text-sm text-gray-500">إدارة المتجر</span>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center space-x-2 space-x-reverse">
              <Plus className="w-4 h-4" />
              <span>إضافة منتج</span>
            </button>
            <Link href="/" className="text-gray-600 hover:text-gray-900">العودة للمتجر</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث..."
                className="pr-10 pl-4 py-2 border rounded-lg focus:border-emerald-500 focus:outline-none w-full sm:w-64"
              />
            </div>
            <select
              title="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              <option value="">جميع الفئات</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name_ar || c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{filteredProducts.length} منتج</span>
          </div>
        </div>

        {/* Products Table/Grid */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">لا توجد منتجات</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الفئة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المخزون</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Image src={getProductImage(product.images)} alt={product.name} width={40} height={40} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name_ar || product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{product.categories?.name_ar || product.categories?.name}</td>
                      <td className="px-6 py-4 text-sm font-medium">{product.price.toFixed(2)} د.م</td>
                      <td className="px-6 py-4 text-sm">{product.stock || 0} قطعة</td>
                      <td className="px-6 py-4 text-sm space-x-2 space-x-reverse">
                        <button title="Edit" className="text-blue-600 hover:text-blue-900"><Edit2 className="w-4 h-4 inline" /></button>
                        <button title="Delete" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
