import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const OrderHistory = () => {
  const { user, getAuthHeaders } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders', {
          headers: getAuthHeaders()
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };

    if (user) {
      fetchOrders();
    }
  }, [user, getAuthHeaders]);

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'في الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'مُرسل',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };
    return statusMap[status] || status;
  };

  if (!user) {
    return <div style={{ padding: '2rem 5%', textAlign: 'center' }}>يجب تسجيل الدخول لرؤية الطلبات</div>;
  }

  if (loading) {
    return <div style={{ padding: '2rem 5%', textAlign: 'center' }}>جاري تحميل الطلبات...</div>;
  }

  return (
    <div style={{ padding: '2rem 5%' }}>
      <h1>تاريخ الطلبات</h1>

      {orders.length === 0 ? (
        <p>لا توجد طلبات سابقة</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>طلب #{order.id}</h3>
                <span className={`status ${order.status}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="order-details">
                <p><strong>التاريخ:</strong> {new Date(order.created_at).toLocaleDateString('ar-MA')}</p>
                <p><strong>الإجمالي:</strong> {order.total} DH</p>
                <div className="order-items">
                  <strong>المنتجات:</strong>
                  <ul>
                    {JSON.parse(order.items).map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.quantity}x - {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="delivery-info">
                  <strong>معلومات التوصيل:</strong>
                  <p>{JSON.parse(order.delivery_info).name}</p>
                  <p>{JSON.parse(order.delivery_info).phone}</p>
                  <p>{JSON.parse(order.delivery_info).address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
