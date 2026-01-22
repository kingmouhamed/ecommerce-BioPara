import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Cart = ({ isOpen, onClose, cart, removeFromCart, calculateTotal, deliveryInfo, setDeliveryInfo, handleCheckout }) => {
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const cartStyle = 'w-full min-h-screen flex';
  const sidebarStyle = 'relative ml-auto w-full max-w-sm bg-white h-full flex flex-col shadow-lg';

  return (
    <div className={cartStyle}>
      <div className={sidebarStyle}>
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">سلة التسوق</h2>
            <button onClick={onClose} className="p-2 bg-none border-none cursor-pointer">
              <X size={24} />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-center py-10 text-gray-600">السلة فارغة</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <img src={item.image ? `/${item.image}` : ''} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.price}</p>
                    <p className="text-sm">الكمية: {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 bg-none border-none cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 mt-auto border-t border-gray-300">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>المجموع:</span>
              <span>{calculateTotal()} DH</span>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-lg font-semibold">بيانات التوصيل</h3>
              <input
                type="text"
                placeholder="الاسم"
                value={deliveryInfo.name}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={deliveryInfo.phone}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="العنوان"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg min-h-24"
              ></textarea>
            </div>
            {deliveryInfo.name && deliveryInfo.phone && deliveryInfo.address && (
              <div className="p-4 bg-gray-100 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">معلومات المشتري</h3>
                <p><strong>الاسم:</strong> {deliveryInfo.name}</p>
                <p><strong>رقم الهاتف:</strong> {deliveryInfo.phone}</p>
                <p><strong>العنوان:</strong> {deliveryInfo.address}</p>
              </div>
            )}
            <button
              onClick={handleCheckout}
              className="w-full text-lg bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
            >
              تأكيد الطلب
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
