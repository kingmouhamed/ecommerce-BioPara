import React from 'react';

const Sidebar = ({ activeCategory, onCategoryClick }) => {
  const categories = ["الرئيسية", "الاعشاب الطبية", "Parapharmacie"];
  
  // Basic styles for the sidebar, can be moved to index.css later
  const sidebarStyle = {
    width: '250px',
    padding: '20px',
    borderLeft: '1px solid #eee',
    height: '100%',
  };
  
  const filterGroupStyle = {
    marginBottom: '2rem',
  };
  
  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    borderBottom: '2px solid var(--primary)',
    paddingBottom: '0.5rem',
  };
  
  const categoryLinkStyle = {
    display: 'block',
    padding: '8px 0',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    textDecoration: 'none',
    color: '#333',
  };

  const activeCategoryStyle = {
    ...categoryLinkStyle,
    color: 'var(--primary)',
    fontWeight: 'bold',
  };

  return (
    <aside style={sidebarStyle}>
      <div style={filterGroupStyle}>
        <h3 style={titleStyle}>التصنيفات</h3>
        <div>
          {categories.map(category => (
            <a 
              key={category}
              style={category === activeCategory ? activeCategoryStyle : categoryLinkStyle}
              onClick={() => onCategoryClick(category)}
            >
              {category}
            </a>
          ))}
        </div>
      </div>

      {/* Placeholder for Price Filter */}
      <div style={filterGroupStyle}>
        <h3 style={titleStyle}>السعر</h3>
        {/* Price range slider or inputs will go here */}
        <p style={{color: '#888'}}>سيتم إضافة فلتر السعر قريبًا</p>
      </div>

      {/* Placeholder for Rating Filter */}
      <div style={filterGroupStyle}>
        <h3 style={titleStyle}>التقييم</h3>
        {/* Rating filter will go here */}
        <p style={{color: '#888'}}>سيتم إضافة فلتر التقييم قريبًا</p>
      </div>
    </aside>
  );
};

export default Sidebar;
