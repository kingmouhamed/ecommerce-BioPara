import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { UserProvider } from './contexts/UserContext.jsx';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderHistory from './pages/OrderHistory';
import Favorites from './pages/Favorites';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import Addresses from './pages/Addresses';
import Coupons from './pages/Coupons';
import Credits from './pages/Credits';
import Delivery from './pages/Delivery';
import Legal from './pages/Legal';
import Payment from './pages/Payment';
import RoutesPage from './pages/RoutesPage';
import Terms from './pages/Terms';
import Cart from './components/Cart';
import products from './products'; // Import products

function App() {
  return <AppContent />;
}

function AppContent() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({ name: '', phone: '', address: '' });
  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    console.log('Added to cart:', product);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(" DH", ""));
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("سلتك فارغة!");
      return;
    }
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert("الرجاء إدخال جميع بيانات التوصيل.");
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <HelmetProvider>
      <UserProvider>
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          removeFromCart={removeFromCart}
          calculateTotal={calculateTotal}
          deliveryInfo={deliveryInfo}
          setDeliveryInfo={setDeliveryInfo}
          handleCheckout={handleCheckout}
        />
        <Layout cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} setIsCartOpen={setIsCartOpen}>
          <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
            <Route path="/products" element={<Products products={products} addToCart={addToCart} />} />
            <Route path="/products/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage 
              cart={cart}
              removeFromCart={removeFromCart}
              calculateTotal={calculateTotal}
              deliveryInfo={deliveryInfo}
              setDeliveryInfo={setDeliveryInfo}
              handleCheckout={handleCheckout}
            />} />
            <Route path="/checkout" element={<Checkout cart={cart} deliveryInfo={deliveryInfo} total={calculateTotal()} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<SearchResults products={products} />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
