// =================================
// REVENUE CHART COMPONENT
// =================================

'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);

  useEffect(() => {
    async function fetchRevenueData() {
      try {
        const response = await fetch(`/api/admin/revenue?range=${timeRange}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data.chart);
          setTotalRevenue(result.data.total);
          setRevenueChange(result.data.change);
        }
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRevenueData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const isPositive = revenueChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Revenue Overview</h3>
        
        <div className="flex items-center space-x-4">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Change</span>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{revenueChange.toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg. Daily</span>
            <DollarSign className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${(totalRevenue / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365)).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No revenue data available</p>
          </div>
        ) : (
          <div className="h-full flex items-end space-x-2">
            {data.map((point, index) => (
              <div
                key={index}
                className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-t relative group"
                style={{ height: `${(point.revenue / maxRevenue) * 100}%` }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  <div className="font-medium">${point.revenue.toFixed(2)}</div>
                  <div className="text-gray-300">{point.date}</div>
                  <div className="text-gray-400">{point.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Revenue</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
          <span>Orders</span>
        </div>
      </div>
    </div>
  );
}
