import React, { useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  isNew?: boolean;
}

interface FeaturedTabsProps {
  newArrivals?: Product[];
  bestSellers?: Product[];
}

const FeaturedTabs = ({ newArrivals = [], bestSellers = [] }: FeaturedTabsProps) => {
  const [activeTab, setActiveTab] = useState("new");

  const tabs = [
    { id: "new", label: "وصل حديثاً", count: newArrivals.length },
    { id: "best", label: "الأكثر مبيعاً", count: bestSellers.length }
  ];

  const displayProducts = activeTab === "new" ? newArrivals : bestSellers;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          المنتجات المميزة
        </h2>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
                <span className="mr-2 text-sm">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayProducts.slice(0, 10).map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🌿</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                {product.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-emerald-600 font-bold">
                  {product.price} د.م
                </span>
                {product.oldPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    {product.oldPrice} د.م
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTabs;
