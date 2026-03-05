// =================================
// TOP PRODUCTS COMPONENT
// =================================

'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Package, Eye } from 'lucide-react';

interface TopProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  total_sold: number;
  revenue: number;
  image_url: string;
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const response = await fetch(`/api/admin/products/top?range=${timeRange}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch top products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopProducts();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No products found</p>
          </div>
        ) : (
          products.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                <img
                  src={product.image_url || '/images/products/product-placeholder.jpg'}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <span className="text-lg font-bold text-gray-900">
                    #{index + 1}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{product.total_sold} sold</span>
                  <span>${product.revenue.toFixed(2)} revenue</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Price: ${product.price.toFixed(2)}</span>
                  <span>Stock: {product.stock_quantity}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12.5%</span>
                </div>
                
                <div className="flex items-center text-blue-600">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>1,234 views</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href="/admin/products"
          className="text-sm text-blue-600 hover:text-blue-900 font-medium"
        >
          View all products →
        </a>
      </div>
    </div>
  );
}
