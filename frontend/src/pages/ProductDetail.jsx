import React from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';

const ProductDetail = ({ products, addToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div style={{ padding: '2rem 5%', textAlign: 'center' }}>المنتج غير موجود</div>;
  }

  return (
    <div style={{ padding: '2rem 5%' }}>
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image ? `/${product.image}` : ''} alt={product.name} style={{ width: '100%', maxWidth: '400px' }} />
          {product.isNew && <span className="badge new">NOUVEAU</span>}
          {product.originalPrice && <span className="badge promo">PROMO</span>}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#ffc107' : 'none'} color="#ffc107" />
            ))}
            <span>({product.reviews} تقييم)</span>
          </div>
          <div className="price">
            {product.originalPrice && <span className="original-price">{product.originalPrice} DH</span>}
            <span className="current-price">{product.price}</span>
          </div>
          <p className="category">الفئة: {product.category}</p>
          <button className="add-btn" onClick={() => addToCart(product)}>
            <ShoppingCart size={16} style={{ marginRight: '8px' }} />
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;