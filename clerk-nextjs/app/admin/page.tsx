"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, TrendingUp, Users, ShoppingCart, Eye, Filter, Grid, List, X, ChevronDown, Upload, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '../../components/ui/Toast';
import { CATEGORIES, SAMPLE_PRODUCTS, getProductBySlug, getProductsByCategory } from '../../lib/categories';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  badge?: string;
  tags: string[];
}

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0
  });

  const { addToast } = useToast();

  useEffect(() => {
    // Calculate stats
    const lowStock = products.filter(p => p.inStock && p.stockCount && p.stockCount < 10).length;
    const outOfStock = products.filter(p => !p.inStock).length;
    
    setStats({
      totalProducts: products.length,
      totalOrders: 156, // Mock data
      totalRevenue: 45678, // Mock data
      totalUsers: 1234, // Mock data
      lowStockProducts: lowStock,
      outOfStockProducts: outOfStock
    });
  }, [products]);

  useEffect(() => {
    let filtered = products;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus === 'inStock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (selectedStatus === 'outOfStock') {
      filtered = filtered.filter(product => !product.inStock);
    } else if (selectedStatus === 'lowStock') {
      filtered = filtered.filter(product => product.inStock && product.stockCount && product.stockCount < 10);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  const handleDeleteProduct = (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== productId));
      addToast({
        type: 'success',
        title: 'تم حذف المنتج',
        message: 'تم حذف المنتج بنجاح'
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleSaveProduct = (product: Product) => {
    // In a real app, this would save to a database
    if (selectedProduct) {
      // Edit existing product
      setProducts(products.map(p => p.id === product.id ? product : p));
      addToast({
        type: 'success',
        title: 'تم تحديث المنتج',
        message: 'تم تحديث المنتج بنجاح'
      });
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: `prod-${Date.now()}`,
        reviewCount: 0
      };
      setProducts([...products, newProduct]);
      addToast({
        type: 'success',
        title: 'تم إضافة المنتج',
        message: 'تم إضافة المنتج بنجاح'
      });
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <span className="text-sm text-gray-500">إدارة المتجر</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={handleAddProduct}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 space-x-reverse"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج</span>
              </button>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                العودة للمتجر
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-emerald-600" />
              <span className="text-sm text-gray-500">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
            <p className="text-sm text-gray-600">إجمالي المنتجات</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-500">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            <p className="text-sm text-gray-600">إجمالي الطلبات</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-sm text-gray-500">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} د.م</h3>
            <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-gray-500">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <span className="text-sm text-gray-500">تحذير</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</h3>
            <p className="text-sm text-gray-600">منتجات قليلة المخزون</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <X className="w-8 h-8 text-red-600" />
              <span className="text-sm text-gray-500">خطأ</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.outOfStockProducts}</h3>
            <p className="text-sm text-gray-600">منتجات نفدت</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="البحث عن منتجات..."
                  className="w-full sm:w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="">جميع الفئات</option>
                {CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.nameAr}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="inStock">متوفر</option>
                <option value="outOfStock">نفد المخزون</option>
                <option value="lowStock">قليل المخزون</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'} rounded-l-lg`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'} rounded-r-lg`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <span className="text-sm text-gray-600">
                {filteredProducts.length} منتج
              </span>
            </div>
          </div>
        </div>

        {/* Products Table/Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 border-t-transparent"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-600 mb-4">لم يتم العثور على منتجات تطابق معايير البحث</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-medium">نفد المخزون</span>
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-emerald-600">{product.price.toFixed(2)} د.م</span>
                      <span className="text-sm text-gray-500">{product.stockCount} قطعة</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 space-x-reverse"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 space-x-reverse"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفئة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخزون</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{product.price.toFixed(2)} د.م</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{product.stockCount || 0} قطعة</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'متوفر' : 'نفد المخزون'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedProduct(null);
            }} />
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {selectedProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
              </h2>
              {/* Add/Edit form would go here */}
              <div className="flex justify-end space-x-4 space-x-reverse">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleSaveProduct(selectedProduct || {} as Product)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
