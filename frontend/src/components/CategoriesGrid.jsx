import React from 'react';
import { Heart, Shield, Sparkles, Droplets } from 'lucide-react';

const CategoriesGrid = () => {
  const categories = [
    {
      id: 'herbal',
      name: 'الاعشاب الطبية',
      icon: <Heart className="category-icon" />,
      description: 'منتجات طبيعية للصحة'
    },
    {
      id: 'cosmetics',
      name: 'مستحضرات التجميل',
      icon: <Sparkles className="category-icon" />,
      description: 'عناية بالبشرة والجسم'
    },
    {
      id: 'hair',
      name: 'عناية الشعر',
      icon: <Droplets className="category-icon" />,
      description: 'منتجات للشعر الجميل'
    },
    {
      id: 'health',
      name: 'الصحة والعافية',
      icon: <Shield className="category-icon" />,
      description: 'مكملات غذائية وصحية'
    }
  ];

  return (
    <section className="categories-grid-section">
      <div className="container">
        <h2 className="section-title">استكشف الفئات</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-icon-wrapper">
                {category.icon}
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;