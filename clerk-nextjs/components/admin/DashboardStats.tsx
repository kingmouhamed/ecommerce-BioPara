// =================================
// DASHBOARD STATS COMPONENT
// =================================

'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  newCustomersThisMonth: number;
  averageOrderValue: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    ordersThisMonth: 0,
    revenueThisMonth: 0,
    newCustomersThisMonth: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersThisMonth,
      changeText: 'this month',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueThisMonth,
      changeText: 'this month',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: stats.newCustomersThisMonth,
      changeText: 'new this month',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: 0,
      changeText: 'total',
      icon: Package,
      color: 'orange',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="ml-4">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{stat.change.toLocaleString()} {stat.changeText}
              </span>
            </div>
          </div>
        );
      })}
      
      {/* Additional Stats Row */}
      <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Order Value</p>
            <p className="text-xl font-bold text-gray-900">
              ${stats.averageOrderValue.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-xl font-bold text-gray-900">3.2%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Cart Abandonment</p>
            <p className="text-xl font-bold text-gray-900">68.4%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
