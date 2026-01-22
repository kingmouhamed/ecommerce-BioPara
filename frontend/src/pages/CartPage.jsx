import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cart, removeFromCart, calculateTotal, deliveryInfo, setDeliveryInfo, handleCheckout }) => {
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft /> عودة
        </button>
        <h1>سلة التسوق</h1>
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={64} />
            <h2>السلة فارغة</h2>
            <p>ابدأ بإضافة منتجات إلى سلتك</p>
            <button className="continue-shopping" onClick={() => navigate('/')}>
              متابعة التسوق
            </button>
          </div>
        ) : (
          <div className="cart-container">
            <section className="cart-items">
              <h2>منتجاتك ({cart.length} منتج)</h2>
              <div className="items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="category">{item.category}</p>
                      <p className="price">{item.price}</p>
                    </div>
                    <div className="item-quantity">
                      <span>الكمية: {item.quantity || 1}</span>
                    </div>
                    <div className="item-total">
                      {(parseFloat(item.price.replace(' DH', '')) * (item.quantity || 1)).toFixed(2)} DH
                    </div>
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="cart-checkout">
              <div className="checkout-card">
                <h2>معلومات التسليم</h2>
                <div className="delivery-form">
                  <input
                    type="text"
                    name="name"
                    placeholder="الاسم الكامل"
                    value={deliveryInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="رقم الهاتف"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <textarea
                    name="address"
                    placeholder="العنوان التفصيلي"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  />
                </div>

                <div className="order-summary">
                  <h3>ملخص الطلب</h3>
                  <div className="summary-item">
                    <span>المجموع الفرعي:</span>
                    <span>{calculateTotal()} DH</span>
                  </div>
                  <div className="summary-item">
                    <span>التسليم:</span>
                    <span>مجاني</span>
                  </div>
                  <div className="summary-total">
                    <span>الإجمالي:</span>
                    <span>{calculateTotal()} DH</span>
                  </div>
                </div>

                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  إتمام الشراء
                </button>

                <button 
                  className="continue-shopping-btn"
                  onClick={() => navigate('/products')}
                >
                  متابعة التسوق
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;