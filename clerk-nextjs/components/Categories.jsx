import React from 'react';

const Categories = ({ activeCategory, onCategoryClick }) => {
  const categories = {
    'Tous': 'الكل',
    'Visage': 'الوجه',
    'Corps': 'الجسم',
    'Cheveux': 'الشعر'
  };

  return (
    <div className="categories-bar">
      {Object.entries(categories).map(([key, value]) => (
        <button
          key={key}
          className={activeCategory === key ? 'active' : ''}
          onClick={() => onCategoryClick(key)}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

export default Categories;