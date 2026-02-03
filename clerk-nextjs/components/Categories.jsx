import React from 'react';

const Categories = ({ activeCategory, onCategoryClick }) => {
  const categories = {
    'Tous': 'الكل',
    'الأعشاب الطبية': 'الأعشاب الطبية',
    'Parapharmacie': 'الصيدلية'
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {Object.entries(categories).map(([key, value]) => (
        <button
          key={key}
          className={`px-6 py-2 rounded-full font-medium transition ${
            activeCategory === key 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onCategoryClick(key)}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

export default Categories;