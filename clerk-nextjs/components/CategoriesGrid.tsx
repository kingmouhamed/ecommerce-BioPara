import React from "react";

const CategoriesGrid = () => {
  const categories = [
    {
      id: 1,
      name: "العناية بالبشرة",
      icon: "🧴",
      count: 45,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      name: "العناية بالجسم",
      icon: "🌿",
      count: 32,
      color: "bg-green-100 text-green-600"
    },
    {
      id: 3,
      name: "العناية بالشعر",
      icon: "💇",
      count: 28,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 4,
      name: "الزيوت العطرية",
      icon: "💧",
      count: 18,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      id: 5,
      name: "الأعشاب الطبية",
      icon: "🌱",
      count: 24,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 6,
      name: "العناية بالرضع",
      icon: "👶",
      count: 15,
      color: "bg-pink-100 text-pink-600"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          تصفح حسب الفئة
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl ${category.color} group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.count} منتج
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
