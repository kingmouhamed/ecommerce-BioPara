import { Resend } from 'resend';

class EmailService {
  constructor() {
    this.resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    this.from = `${process.env.RESEND_FROM_NAME || 'BioPara'} <${process.env.RESEND_FROM || 'onboarding@resend.dev'}>`;
  }

  /**
   * إرسال بريد إلكتروني
   * @param {Object} options - خيارات الإرسال
   * @param {string} options.to - البريد الإلكتروني للمستلم
   * @param {string} options.subject - عنوان البريد
   * @param {string} options.html - محتوى HTML
   * @param {string} options.text - محتوى نصي (اختياري)
   * @returns {Promise<Object>} - نتيجة الإرسال
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      // التحقق من البيانات
      if (!to || !subject || !html) {
        throw new Error('Missing required fields: to, subject, and html');
      }

      // التحقق من صحة البريد
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        throw new Error('Invalid email address');
      }

      if (!this.resend) {
        throw new Error('Resend is not configured (missing API key)');
      }

      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to: [to],
        subject: subject,
        html: html,
        text: text || this.htmlToText(html),
      });

      if (error) {
        console.error('EmailService Error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log('Email sent successfully:', data);
      return {
        success: true,
        data: {
          id: data.id,
          from: data.from,
          to: data.to,
          subject: data.subject
        }
      };
    } catch (error) {
      console.error('EmailService Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * تحويل HTML إلى نص (بسيط)
   * @param {string} html - محتوى HTML
   * @returns {string} - محتوى نصي
   */
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  /**
   * التحقق من توفر خدمة البريد
   * @returns {Promise<boolean>} - هل الخدمة متاحة
   */
  async isAvailable() {
    try {
      const response = await fetch('https://api.resend.com/health', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
const emailService = new EmailService();

export default emailService;
