import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import '../../src/admin.css';

const Admin = () => {
  const { user, getAuthHeaders } = useUser();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    rating: ''
  });

  const openAddProductModal = () => {
    setEditingProduct(null);
    setNewProduct({ name: '', description: '', price: '', category: '', image: '', rating: '' });
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setNewProduct({ name: '', description: '', price: '', category: '', image: '', rating: '' });
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct
      ? `http://localhost:3001/api/products/${editingProduct.id}`
      : 'http://localhost:3001/api/products';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        closeProductModal();
        fetchData(); // Refresh products list
      } else {
        console.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        fetchData(); // Refresh products list
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        setProducts(data);
      } else if (activeTab === 'orders') {
        const response = await fetch('http://localhost:3001/api/admin/orders', {
          headers: getAuthHeaders()
        });
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab, getAuthHeaders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (!user) {
    return <div style={{ padding: '2rem 5%', textAlign: 'center' }}>يجب تسجيل الدخول للوصول إلى هذه الصفحة.</div>;
  }

  if (user.role !== 'admin') {
    return <div style={{ padding: '2rem 5%', textAlign: 'center' }}>الوصول مرفوض. هذه الصفحة مخصصة للمسؤولين فقط.</div>;
  }

  return (
    <div style={{ padding: '2rem 5%' }}>
      <h1>لوحة الإدارة</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          المنتجات
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          الطلبات
        </button>
      </div>

      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <>
          {activeTab === 'products' && (
            <div className="admin-products">
              <h2>إدارة المنتجات</h2>
              <button onClick={openAddProductModal} style={{ marginBottom: '1rem' }}>إضافة منتج جديد</button>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>الاسم</th>
                    <th>الفئة</th>
                    <th>السعر</th>
                    <th>التقييم</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.price}</td>
                      <td>{product.rating}</td>
                      <td>
                        <button onClick={() => openEditProductModal(product)}>تعديل</button>
                        <button onClick={() => handleDeleteProduct(product.id)}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-orders">
              <h2>إدارة الطلبات</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>العميل</th>
                    <th>الإجمالي</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.user_name || 'غير محدد'}</td>
                      <td>{order.total} DH</td>
                      <td>{order.status}</td>
                      <td>{new Date(order.created_at).toLocaleDateString('ar-MA')}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">في الانتظار</option>
                          <option value="processing">قيد المعالجة</option>
                          <option value="shipped">مُرسل</option>
                          <option value="delivered">تم التسليم</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showProductModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            <form onSubmit={handleProductSubmit}>
              <label>
                الاسم:
                <input type="text" name="name" value={newProduct.name} onChange={handleProductFormChange} required />
              </label>
              <label>
                الوصف:
                <textarea name="description" value={newProduct.description} onChange={handleProductFormChange}></textarea>
              </label>
              <label>
                السعر:
                <input type="number" name="price" value={newProduct.price} onChange={handleProductFormChange} required />
              </label>
              <label>
                الفئة:
                <input type="text" name="category" value={newProduct.category} onChange={handleProductFormChange} required />
              </label>
              <label>
                الصورة (URL):
                <input type="text" name="image" value={newProduct.image} onChange={handleProductFormChange} required />
              </label>
              <label>
                التقييم (1-5):
                <input type="number" name="rating" value={newProduct.rating} onChange={handleProductFormChange} min="1" max="5" required />
              </label>
              <div className="modal-actions">
                <button type="submit">{editingProduct ? 'تعديل المنتج' : 'إضافة المنتج'}</button>
                <button type="button" onClick={closeProductModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
