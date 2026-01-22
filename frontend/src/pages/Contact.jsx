import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('شكراً لتواصلك معنا! سنرد عليك قريباً.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1>اتصل بنا</h1>
        <p>نحن هنا للاستماع إلى آرائك واستفساراتك</p>
      </section>

      <div className="contact-container">
        <section className="contact-info">
          <h2>معلومات التواصل</h2>
          <div className="info-items">
            <div className="info-item">
              <Phone size={24} className="info-icon" />
              <div>
                <h3>الهاتف</h3>
                <p>+(212) 673020264</p>
                <p>+(212) 673020264</p>
              </div>
            </div>
            <div className="info-item">
              <Mail size={24} className="info-icon" />
              <div>
                <h3>البريد الإلكتروني</h3>
                <p>ilyasseelmoussaoui890@gmail.com</p>
                <p>support@biopara.ma</p>
              </div>
            </div>
            <div className="info-item">
              <MapPin size={24} className="info-icon" />
              <div>
                <h3>العنوان</h3>
                <p>شارع محمد الخامس</p>
                <p>وجدة، المغرب</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <h3>تابعنا على وسائل التواصل</h3>
            <a href="https://www.facebook.com/ilyasse.cina.9a" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com/ilyasseelmoussaoui/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/212673020264" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">الاسم</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="أدخل اسمك"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">الموضوع</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="موضوع الرسالة"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">الرسالة</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="اكتب رسالتك هنا"
                rows="6"
              />
            </div>
            <button type="submit" className="submit-btn">
              <Send size={18} /> إرسال الرسالة
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;