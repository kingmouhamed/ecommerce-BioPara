import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const Checkout = ({ cart, calculateTotal, deliveryInfo, setDeliveryInfo, handleCheckout }) => {
  const total = parseFloat(calculateTotal().replace(' DH', ''));

  return (
    <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
      <div className="checkout-page">
        <h1>إتمام الطلب</h1>
        <div className="checkout-content">
          <div className="order-summary">
            <h2>ملخص الطلب</h2>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.quantity} x {item.price} = {(parseFloat(item.price.replace(' DH', '')) * item.quantity).toFixed(2)} DH
                </li>
              ))}
            </ul>
            <p><strong>الإجمالي: {calculateTotal()} DH</strong></p>
          </div>
          <div className="delivery-form">
            <h2>بيانات التوصيل</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={deliveryInfo.name}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={deliveryInfo.phone}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                required
              />
              <textarea
                placeholder="عنوان التوصيل"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                required
              />
              <button type="submit">إتمام الطلب</button>
            </form>
            <div className="payment-section">
              <h3>الدفع عبر PayPal</h3>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: total.toFixed(2),
                        currency_code: 'USD' // Change to MAD if supported
                      }
                    }]
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert('Transaction completed by ' + details.payer.name.given_name);
                    handleCheckout();
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;