import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ cartItemCount, setIsCartOpen, children }) => {
  return (
    <div>
      <Header cartItemCount={cartItemCount} setIsCartOpen={setIsCartOpen} />
      <main>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
