// =================================
// EMAIL SERVICE
// =================================

import sgMail, { MailDataRequired } from '@sendgrid/mail';

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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

export interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderData {
  order_number: string;
  created_at: string | Date;
  items?: OrderItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  shipping_address: string;
  tracking_url?: string;
  id?: string;
  tracking_number?: string;
}

export interface CartItem {
  name: string;
  price: number;
  image_url: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  /**
   * Send basic email
   */
  static async sendEmail(data: EmailData): Promise<EmailResponse> {
    try {
      let content: EmailContent[] = data.content || [];

      if (content.length === 0) {
        if (data.text && data.html) {
          content = [
            { type: 'text/plain', value: data.text },
            { type: 'text/html', value: data.html },
          ];
        } else if (data.text) {
          content = [{ type: 'text/plain', value: data.text }];
        } else if (data.html) {
          content = [{ type: 'text/html', value: data.html }];
        } else {
          content = [{ type: 'text/plain', value: '' }];
        }
      }

      const msg: MailDataRequired = {
        to: data.to,
        from: data.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        subject: data.subject,
        content: content as any, // Type assertion for SendGrid compatibility
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send template email
   */
  static async sendTemplateEmail(data: EmailData): Promise<EmailResponse> {
    try {
      const msg: MailDataRequired = {
        to: data.to,
        from: data.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: data.templateId!,
        dynamicTemplateData: data.dynamicTemplateData as any,
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
      };
    } catch (error) {
      console.error('Send Template Email Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send template email',
      };
    }
  }

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(
    email: string,
    orderData: OrderData,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-order-confirmation-template-id',
        dynamicTemplateData: {
          customer_name: customerName,
          order_number: orderData.order_number,
          order_date: new Date(orderData.created_at).toLocaleDateString(),
          items: orderData.items?.map((item: OrderItem) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: `$${item.unit_price.toFixed(2)}`,
            total: `$${item.total_price.toFixed(2)}`,
          })) || [],
          subtotal: `$${orderData.subtotal.toFixed(2)}`,
          tax: `$${orderData.tax_amount.toFixed(2)}`,
          shipping: `$${orderData.shipping_amount.toFixed(2)}`,
          total: `$${orderData.total_amount.toFixed(2)}`,
          shipping_address: orderData.shipping_address,
          tracking_url: orderData.tracking_url || '#',
        },
      } as any;

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send shipping confirmation email
   */
  static async sendShippingConfirmation(
    email: string,
    orderData: OrderData,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-shipping-confirmation-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: customerName,
          order_number: orderData.order_number,
          tracking_number: orderData.tracking_number,
          tracking_url: orderData.tracking_url,
          estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          shipping_address: orderData.shipping_address,
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send password reset email
   */
  static async sendPasswordReset(
    email: string,
    resetToken: string,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-password-reset-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: customerName,
          reset_url: resetUrl,
          expiry_hours: '24',
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send welcome email
   */
  static async sendWelcomeEmail(
    email: string,
    customerName: string,
    verificationUrl?: string
  ): Promise<EmailResponse> {
    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-welcome-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: customerName,
          verification_url: verificationUrl,
          shop_url: process.env.NEXT_PUBLIC_APP_URL,
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send newsletter subscription confirmation
   */
  static async sendNewsletterConfirmation(
    email: string,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-newsletter-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: customerName,
          unsubscribe_url: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${email}`,
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send refund confirmation email
   */
  static async sendRefundConfirmation(
    email: string,
    orderData: OrderData,
    refundAmount: number,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-refund-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: customerName,
          order_number: orderData.order_number,
          refund_amount: `$${refundAmount.toFixed(2)}`,
          refund_date: new Date().toLocaleDateString(),
          processing_days: '5-7',
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send review request email
   */
  static async sendReviewRequest(
    email: string,
    orderData: OrderData,
    customerName: string
  ): Promise<EmailResponse> {
    try {
      const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review?order=${orderData.id}`;

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-review-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: customerName,
          order_number: orderData.order_number,
          review_url: reviewUrl,
          items: orderData.items?.slice(0, 3).map((item: OrderItem) => item.product_name) || [],
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send abandoned cart reminder
   */
  static async sendAbandonedCartReminder(
    email: string,
    cartItems: CartItem[],
    customerName: string,
    cartTotal: number
  ): Promise<EmailResponse> {
    try {
      const cartUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cart`;

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-abandoned-cart-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: customerName,
          cart_url: cartUrl,
          cart_total: `$${cartTotal.toFixed(2)}`,
          items: cartItems.slice(0, 3).map((item: CartItem) => ({
            name: item.name,
            price: `$${item.price.toFixed(2)}`,
            image: item.image_url,
          })),
          item_count: cartItems.length,
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
   * Send contact form notification
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
      const msg = {
        to: process.env.SENDGRID_FROM_EMAIL || 'admin@biopara.com',
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biopara.com',
        templateId: 'd-your-contact-template-id', // Replace with actual template ID
        dynamicTemplateData: {
          customer_name: contactData.name,
          customer_email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          timestamp: new Date().toLocaleString(),
        },
      };

      const response = await sgMail.send(msg);

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
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
