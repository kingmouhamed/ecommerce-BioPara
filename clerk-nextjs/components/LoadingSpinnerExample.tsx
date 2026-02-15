"use client";

import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingSpinnerExample() {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">LoadingSpinner Examples</h1>
        
        <div className="space-y-8">
          {/* Full Screen Loading */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Full Screen Loading (Default)</h2>
            <button
              onClick={toggleLoading}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Show Full Screen Loading
            </button>
            {isLoading && <LoadingSpinner />}
          </div>

          {/* Inline Loading Examples */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Inline Loading Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-medium mb-2">Small</h3>
                <LoadingSpinner size="sm" text="جاري التحميل..." />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2">Medium</h3>
                <LoadingSpinner size="md" text="Loading..." />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2">Large</h3>
                <LoadingSpinner size="lg" text="جاري التحميل..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
