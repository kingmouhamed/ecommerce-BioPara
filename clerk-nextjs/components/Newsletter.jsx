"use client";
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('شكراً لاشتراكك في النشرة البريدية!');
    setEmail('');
  };

  return (
    <div className="newsletter-section">
      <div className="newsletter-content">
        <h2>اشترك في النشرة البريدية</h2>
        <p>احصل على أحدث العروض والمنتجات الجديدة</p>
        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input 
            type="email" 
            placeholder="أدخل بريدك الإلكتروني" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">
            <Mail size={18} />
            اشترك
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
