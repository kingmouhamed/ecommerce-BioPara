// =================================
// EMAIL SERVICE (Nodemailer + Brevo SMTP)
// =================================

import nodemailer from 'nodemailer';
import { emailTemplates, OrderData, OrderItem, CartItem } from './emailTemplates';

// Export interfaces for external usage
export type { OrderData, OrderItem, CartItem };

export interface EmailContent {
  type: 'text/plain' | 'text/html';
  value: string;
}

export interface EmailData {
  to: string | string[];
  from?: string;
  subject: string;
  content?: EmailContent[];
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Configure Nodemailer Transporter with Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com',
  port: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
  secure: false, // Port 587 is TLS (secure: false, upgrade via STARTTLS automatically)
  auth: {
    user: process.env.BREVO_SMTP_LOGIN || '',
    pass: process.env.BREVO_SMTP_KEY || '',
  },
});

export class EmailService {
  /**
   * Send basic email using Nodemailer
   */
  static async sendEmail(data: EmailData): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      let htmlContent = data.html || '';
      let textContent = data.text || '';

      if (data.content && data.content.length > 0) {
        for (const item of data.content) {
          if (item.type === 'text/html') {
            htmlContent = item.value;
          } else {
            textContent = item.value;
          }
        }
      }

      const info = await transporter.sendMail({
        from: data.from || `"BioPara" <${defaultFrom}>`,
        to: Array.isArray(data.to) ? data.to.join(', ') : data.to,
        subject: data.subject,
        text: textContent,
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Email Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }

  /**
   * Send template email (Compatibility stub for SMTP)
   */
  static async sendTemplateEmail(data: EmailData): Promise<EmailResponse> {
    console.warn('sendTemplateEmail is called but SendGrid templates are disabled. Falling back to basic email.');
    return this.sendEmail(data);
  }

  /**
   * Send order confirmation email (Arabic RTL HTML Template)
   */
  static async sendOrderConfirmation(
    email: string,
    orderData: OrderData,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const htmlContent = emailTemplates.orderConfirmation(orderData, customerName);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: `تأكيد الطلب رقم #${orderData.order_number} - متجر بيوبارا`,
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Order Confirmation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send order confirmation',
      };
    }
  }

  /**
   * Send shipping confirmation email (Arabic RTL HTML Template)
   */
  static async sendShippingConfirmation(
    email: string,
    orderData: OrderData,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const htmlContent = emailTemplates.shippingConfirmation(orderData, customerName);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: `تم شحن طلبك رقم #${orderData.order_number} بنجاح!`,
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Shipping Confirmation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send shipping confirmation',
      };
    }
  }

  /**
   * Send password reset email (Arabic RTL HTML Template)
   */
  static async sendPasswordReset(
    email: string,
    resetToken: string,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      const htmlContent = emailTemplates.passwordReset(resetUrl, customerName);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: 'إعادة تعيين كلمة المرور لحسابك في بيوبارا',
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Password Reset Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send password reset',
      };
    }
  }

  /**
   * Send welcome email (Arabic RTL HTML Template)
   */
  static async sendWelcomeEmail(
    email: string,
    customerName: string,
    verificationUrl?: string
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const htmlContent = emailTemplates.welcomeEmail(customerName, verificationUrl);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: 'مرحباً بك في بيوبارا - متجر الأعشاب والزيوت الطبيعية',
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Welcome Email Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send welcome email',
      };
    }
  }

  /**
   * Send newsletter subscription confirmation (Arabic RTL HTML Template)
   */
  static async sendNewsletterConfirmation(
    email: string,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${email}`;
      const htmlContent = emailTemplates.newsletterConfirmation(customerName, unsubscribeUrl);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: 'تأكيد اشتراكك في نشرة بيوبارا البريدية + خصم 10%',
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Newsletter Confirmation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send newsletter confirmation',
      };
    }
  }

  /**
   * Send refund confirmation email (Arabic RTL HTML Template)
   */
  static async sendRefundConfirmation(
    email: string,
    orderData: OrderData,
    refundAmount: number,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const htmlContent = emailTemplates.refundConfirmation(orderData, refundAmount, customerName);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: `تأكيد استرداد مالي للطلب #${orderData.order_number}`,
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Refund Confirmation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send refund confirmation',
      };
    }
  }

  /**
   * Send review request email (Arabic RTL HTML Template)
   */
  static async sendReviewRequest(
    email: string,
    orderData: OrderData,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/review?order=${orderData.id}`;
      const htmlContent = emailTemplates.reviewRequest(orderData, reviewUrl, customerName);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: 'رأيك يهمنا! كيف كانت تجربتك مع منتجات بيوبارا؟',
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Review Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send review request',
      };
    }
  }

  /**
   * Send abandoned cart reminder (Arabic RTL HTML Template)
   */
  static async sendAbandonedCartReminder(
    email: string,
    cartItems: CartItem[],
    customerName: string,
    cartTotal: number
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const htmlContent = emailTemplates.abandonedCartReminder(cartItems, customerName, cartTotal);

      const info = await transporter.sendMail({
        from: `"BioPara | بيوبارا" <${defaultFrom}>`,
        to: email,
        subject: 'منتجاتك الرائعة بانتظارك في سلة التسوق - بيوبارا',
        html: htmlContent,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Abandoned Cart Reminder Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send abandoned cart reminder',
      };
    }
  }

  /**
   * Send contact form notification to Admin
   */
  static async sendContactNotification(
    contactData: {
      name: string;
      email: string;
      subject: string;
      message: string;
    }
  ): Promise<EmailResponse> {
    try {
      const defaultFrom = process.env.BREVO_FROM_EMAIL || 'noreply@biopara.com';
      const adminEmail = process.env.BREVO_FROM_EMAIL || 'admin@biopara.com';
      const htmlContent = emailTemplates.contactNotification(contactData);

      const info = await transporter.sendMail({
        from: `"BioPara Contact" <${defaultFrom}>`,
        to: adminEmail,
        subject: `[Contact Form] ${contactData.subject}`,
        html: htmlContent,
        replyTo: contactData.email,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Send Contact Notification Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send contact notification',
      };
    }
  }
}

export default EmailService;
