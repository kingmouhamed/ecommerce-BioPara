import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, LogOut, Menu } from 'lucide-react';
import { useUser } from '../contexts/UserContext.jsx';

const Header = ({ cartItemCount, setIsCartOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeLinkClass = 'bg-green-800 rounded';
  const inactiveLinkClass = 'hover:bg-green-800 hover:rounded';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Brand Section */}
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="flex items-center space-x-2">
              <img src="/parapharma-logo.svg" alt="BioPara Logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold text-green-700 hidden sm:block">BioPara</h1>
            </NavLink>
          </div>

          {/* Search Bar */}
          <div className="flex-1 px-4 lg:px-12">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="البحث عن منتج، علامة تجارية..."
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={22} />
              </button>
            </form>
          </div>

          {/* Header Actions */}
          <div className="hidden md:flex items-center space-x-5 text-gray-600">
            {user ? (
              <div className="relative group">
                <div className="flex items-center cursor-pointer">
                  <User size={24} />
                  <span className="ml-2">{user.name}</span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                  <NavLink to="/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">حسابي</NavLink>
                  <NavLink to="/order-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">طلباتي</NavLink>
                  {user.role === 'admin' && <NavLink to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">لوحة التحكم</NavLink>}
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">تسجيل الخروج</button>
                </div>
              </div>
            ) : (
              <NavLink to="/login" className="hover:text-green-700 flex items-center"><User size={24} /><span className="ml-1">الدخول</span></NavLink>
            )}
            <NavLink to="/favorites" className="hover:text-green-700"><Heart size={24} /></NavLink>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-green-700">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-white text-xs font-bold border-2 border-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-green-700 text-white ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 py-2">
            <li><NavLink to="/" className={({ isActive }) => `block py-2 px-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>الرئيسية</NavLink></li>
            <li><NavLink to="/products" className={({ isActive }) => `block py-2 px-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>جميع المنتجات</NavLink></li>
            <li><NavLink to="/products?category=Visage" className={({ isActive }) => `block py-2 px-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>الاعشاب الطبية</NavLink></li>
            <li><NavLink to="/products?category=Parapharmacie" className={({ isActive }) => `block py-2 px-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>Parapharmacie</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => `block py-2 px-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>من نحن</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => `block py-2 px-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>اتصل بنا</NavLink></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

