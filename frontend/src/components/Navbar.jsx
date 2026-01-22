import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>الرئيسية</NavLink>
      <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>جميع المنتجات</NavLink>
      <NavLink to="/products?category=Visage" className={({ isActive }) => isActive ? 'active' : ''}>الاعشاب الطبية</NavLink>
      <NavLink to="/products?category=Corps" className={({ isActive }) => isActive ? 'active' : ''}>الجسم</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>عن المتجر</NavLink>
      <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>اتصل بنا</NavLink>
    </nav>
  );
};

export default Navbar;
