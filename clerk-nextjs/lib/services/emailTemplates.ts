/**
   Email Templates in Arabic RTL
 */

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

// Global layout wrapper for emails
function wrapLayout(content: string, preheaderText: string = ''): string {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.5">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>BioPara - بيوبارا</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f8fafc;
          color: #334155;
          margin: 0;
          padding: 0;
          direction: rtl;
          text-align: right;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #f8fafc;
          padding: 20px 0;
        }
        .main-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #10b981;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 30px 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 30px 24px;
          line-height: 1.6;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
        .btn {
          display: inline-block;
          background-color: #10b981;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin: 20px 0;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
          transition: all 0.2s;
        }
        .btn:hover {
          background-color: #059669;
        }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-success {
          background-color: #d1fae5;
          color: #065f46;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          padding: 12px;
          text-align: right;
          border-bottom: 1px solid #edf2f7;
        }
        th {
          font-weight: 700;
          color: #475569;
          background-color: #f8fafc;
        }
      </style>
    </head>
    <body>
      ${preheaderText ? `<span style="display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; max-height:0; max-width:0; overflow:hidden;">${preheaderText}</span>` : ''}
      <div class="wrapper">
        <div class="main-container">
          <div class="header">
            <h1>BioPara | بيوبارا</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} BioPara. جميع الحقوق محفوظة.</p>
            <p>أعشاب وزيوت طبيعية 100% مستوحاة من الطبيعة.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const emailTemplates = {
  // 1. Order Confirmation
  orderConfirmation: (orderData: OrderData, customerName: string) => {
    const orderDate = new Date(orderData.created_at).toLocaleDateString('ar-MA');
    const itemsHtml = orderData.items?.map(item => `
      <tr>
        <td style="color:#334155; font-weight:500;">${item.product_name}</td>
        <td style="text-align:center;">${item.quantity}</td>
        <td style="text-align:left; font-weight:600; color:#0f172a;">${item.unit_price.toFixed(2)} د.م</td>
        <td style="text-align:left; font-weight:600; color:#10b981;">${item.total_price.toFixed(2)} د.م</td>
      </tr>
    `).join('') || '';

    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">مرحباً ${customerName}، شكراً لتسوقك معنا!</h2>
      <p>يسعدنا تأكيد استلام طلبك رقم <strong style="color:#10b981;">#${orderData.order_number}</strong> وتجهيزه حالياً للشحن.</p>
      
      <div style="background-color:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0;">
        <h3 style="margin:0 0 10px 0; color:#334155; font-size:15px;">تفاصيل الطلب:</h3>
        <p style="margin:4px 0; font-size:13.5px;"><strong>تاريخ الطلب:</strong> ${orderDate}</p>
        <p style="margin:4px 0; font-size:13.5px;"><strong>عنوان الشحن:</strong> ${orderData.shipping_address}</p>
      </div>

      <table style="font-size:13.5px;">
        <thead>
          <tr>
            <th>المنتج</th>
            <th style="text-align:center;">الكمية</th>
            <th style="text-align:left;">سعر الوحدة</th>
            <th style="text-align:left;">المجموع</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top:20px; border-top:2px solid #f1f5f9; padding-top:15px; font-size:14px;" align="left">
        <table style="width:250px; margin:0 0 0 auto; font-size:13.5px;">
          <tr>
            <td style="border:none; padding:4px 0;">المجموع الفرعي:</td>
            <td style="border:none; padding:4px 0; text-align:left; font-weight:600;">${orderData.subtotal.toFixed(2)} د.م</td>
          </tr>
          <tr>
            <td style="border:none; padding:4px 0;">الضريبة:</td>
            <td style="border:none; padding:4px 0; text-align:left; font-weight:600;">${orderData.tax_amount.toFixed(2)} د.م</td>
          </tr>
          <tr>
            <td style="border:none; padding:4px 0;">مصاريف الشحن:</td>
            <td style="border:none; padding:4px 0; text-align:left; font-weight:600;">${orderData.shipping_amount.toFixed(2)} د.م</td>
          </tr>
          <tr style="font-size:16px; font-weight:bold; color:#10b981;">
            <td style="border-top:1px solid #e2e8f0; padding:10px 0;">الإجمالي:</td>
            <td style="border-top:1px solid #e2e8f0; padding:10px 0; text-align:left;">${orderData.total_amount.toFixed(2)} د.م</td>
          </tr>
        </table>
      </div>
    `;
    return wrapLayout(htmlContent, `تأكيد الطلب رقم #${orderData.order_number} من BioPara`);
  },

  // 2. Shipping Confirmation
  shippingConfirmation: (orderData: OrderData, customerName: string) => {
    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">خبر سار ${customerName}! طلبك في الطريق إليك</h2>
      <p>تم شحن طلبك رقم <strong style="color:#10b981;">#${orderData.order_number}</strong> بنجاح.</p>
      
      <div style="background-color:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0;">
        <h3 style="margin:0 0 10px 0; color:#334155; font-size:15px;">تفاصيل الشحنة:</h3>
        <p style="margin:4px 0; font-size:13.5px;"><strong>رقم التتبع:</strong> <span style="font-family:monospace; font-weight:bold; color:#0f172a;">${orderData.tracking_number || 'غير متوفر حالياً'}</span></p>
        <p style="margin:4px 0; font-size:13.5px;"><strong>عنوان التسليم:</strong> ${orderData.shipping_address}</p>
      </div>

      ${orderData.tracking_url ? `
        <div style="text-align:center;">
          <a href="${orderData.tracking_url}" class="btn" target="_blank">تتبع حالة شحنتك</a>
        </div>
      ` : ''}

      <p style="font-size:13px; color:#64748b; margin-top:20px;">* قد يستغرق تحديث معلومات تتبع الشحنة على نظام شركة التوصيل ما يصل إلى 24 ساعة.</p>
    `;
    return wrapLayout(htmlContent, `تم شحن طلبك رقم #${orderData.order_number} بنجاح!`);
  },

  // 3. Password Reset
  passwordReset: (resetUrl: string, customerName: string) => {
    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">إعادة تعيين كلمة المرور</h2>
      <p>مرحباً ${customerName}،</p>
      <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في BioPara. إذا قمت بتقديم هذا الطلب، يرجى الضغط على الزر أدناه:</p>
      
      <div style="text-align:center;">
        <a href="${resetUrl}" class="btn" target="_blank">إعادة تعيين كلمة المرور</a>
      </div>

      <p style="font-size:13px; color:#64748b;">إذا لم تطلب تغيير كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني بأمان وسيبقى حسابك محمياً.</p>
      <p style="font-size:12px; color:#94a3b8; border-top:1px solid #f1f5f9; padding-top:10px;">هذا الرابط صالح لمدة 24 ساعة فقط.</p>
    `;
    return wrapLayout(htmlContent, 'طلب إعادة تعيين كلمة المرور لحساب BioPara');
  },

  // 4. Welcome Email
  welcomeEmail: (customerName: string, verificationUrl?: string) => {
    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">أهلاً بك في عالم الصحة والجمال الطبيعي!</h2>
      <p>مرحباً ${customerName}، يسعدنا جداً انضمامك إلى عائلة BioPara.</p>
      <p>هدفنا هو تزويدك بأفضل الأعشاب والمنتجات العضوية والزيوت الطبيعية 100% للعناية بصحتك وجمالك.</p>
      
      ${verificationUrl ? `
        <p>لتفعيل حسابك والاستفادة من كافة الميزات، يرجى الضغط على زر التأكيد أدناه:</p>
        <div style="text-align:center;">
          <a href="${verificationUrl}" class="btn" target="_blank">تأكيد وتفعيل الحساب</a>
        </div>
      ` : `
        <div style="text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" class="btn" target="_blank">زيارة المتجر وابدأ التسوق</a>
        </div>
      `}

      <p style="margin-top:20px;">إذا واجهت أي مشاكل أو كان لديك استفسار، فريق الدعم الفني متواجد دائماً لمساعدتك.</p>
    `;
    return wrapLayout(htmlContent, 'مرحباً بك في BioPara - متجرك للمنتجات العشبية والزيوت الطبيعية');
  },

  // 5. Newsletter Subscription Confirmation
  newsletterConfirmation: (customerName: string, unsubscribeUrl: string) => {
    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">تم اشتراكك بنجاح في نشرتنا البريدية!</h2>
      <p>مرحباً ${customerName}،</p>
      <p>شكراً لاهتمامك بمتابعة BioPara. من الآن فصاعداً، ستكون أول من يتلقى عروضنا الحصرية، والنصائح الصحية الهامة، بالإضافة إلى مقالاتنا الجديدة حول الاستخدامات الطبية والعلاجية للأعشاب الطبيعية.</p>
      
      <div style="background-color:#ecfdf5; border:1px dashed #10b981; padding:15px; border-radius:8px; text-align:center; margin:20px 0;">
        <span style="color:#065f46; font-weight:bold; font-size:15px;">رمز الخصم الخاص بك كعضو جديد:</span>
        <div style="font-size:24px; font-weight:800; color:#10b981; margin:8px 0; font-family:monospace; letter-spacing:1px;">BIOPARA10</div>
        <p style="margin:0; font-size:12.5px; color:#047857;">خصم 10% على طلبك القادم</p>
      </div>

      <p style="font-size:12px; color:#94a3b8; border-top:1px solid #f1f5f9; padding-top:15px; margin-top:25px;">
        لإلغاء الاشتراك في أي وقت، يمكنك الضغط على <a href="${unsubscribeUrl}" style="color:#64748b; text-decoration:underline;">إلغاء الاشتراك هنا</a>.
      </p>
    `;
    return wrapLayout(htmlContent, 'تأكيد الاشتراك في نشرة بيوبارا البريدية + هدية ترحيبية!');
  },

  // 6. Refund Confirmation
  refundConfirmation: (orderData: OrderData, refundAmount: number, customerName: string) => {
    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">تأكيد استرداد الأموال</h2>
      <p>مرحباً ${customerName}،</p>
      <p>نود إعلامك بأنه تم إصدار استرداد مالي بقيمة <strong style="color:#10b981;">${refundAmount.toFixed(2)} د.م</strong> لطلبك رقم <strong>#${orderData.order_number}</strong>.</p>
      
      <div style="background-color:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0;">
        <p style="margin:4px 0; font-size:13.5px;"><strong>رقم الطلب:</strong> #${orderData.order_number}</p>
        <p style="margin:4px 0; font-size:13.5px;"><strong>قيمة المبلغ المسترد:</strong> ${refundAmount.toFixed(2)} د.م</p>
        <p style="margin:4px 0; font-size:13.5px;"><strong>طريقة الاسترداد:</strong> نفس وسيلة الدفع الأصلية</p>
      </div>

      <p>عادةً ما تظهر المبالغ المستردة في حسابك البنكي خلال 5 إلى 7 أيام عمل، وذلك بناءً على سياسة البنك الخاص بك.</p>
      <p>إذا كان لديك أي استفسار إضافي، فلا تتردد في مراسلتنا.</p>
    `;
    return wrapLayout(htmlContent, `تأكيد استرداد مالي للطلب #${orderData.order_number}`);
  },

  // 7. Review Request
  reviewRequest: (orderData: OrderData, reviewUrl: string, customerName: string) => {
    const itemsHtml = orderData.items?.slice(0, 3).map(item => `
      <li style="margin:5px 0; color:#334155; font-weight:500;">${item.product_name}</li>
    `).join('') || '';

    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">ما رأيك في المنتجات التي اشتريتها؟</h2>
      <p>مرحباً ${customerName}،</p>
      <p>نأمل أن تكون قد استمتعت بطلبك الأخير رقم <strong>#${orderData.order_number}</strong>.</p>
      <p>نحن نهتم جداً برأيك وتجربتك معنا لمساعدتنا على تحسين جودة منتجاتنا وخدماتنا. يسعدنا مشاركة رأيك حول المنتجات التالية:</p>
      
      <ul style="padding-right:20px; font-size:13.5px;">
        ${itemsHtml}
      </ul>

      <div style="text-align:center;">
        <a href="${reviewUrl}" class="btn" target="_blank">كتابة تقييم ومراجعة المنتجات</a>
      </div>

      <p>تقييمك يستغرق دقيقة واحدة فقط ويساعد مجتمع بيوبارا بأكمله على اتخاذ قرارات صحية أفضل!</p>
    `;
    return wrapLayout(htmlContent, 'رأيك يهمنا! كيف كانت تجربتك مع منتجات BioPara؟');
  },

  // 8. Abandoned Cart Reminder
  abandonedCartReminder: (cartItems: CartItem[], customerName: string, cartTotal: number) => {
    const itemsHtml = cartItems.slice(0, 3).map(item => `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; border-bottom:1px solid #edf2f7; padding-bottom:12px;">
        <img src="${item.image_url}" alt="${item.name}" style="width:50px; height:50px; object-cover:cover; border-radius:6px; background-color:#f1f5f9; border:1px solid #e2e8f0;" />
        <div>
          <h4 style="margin:0; font-size:13.5px; color:#334155;">${item.name}</h4>
          <span style="font-size:13px; font-weight:bold; color:#10b981;">${item.price.toFixed(2)} د.م</span>
        </div>
      </div>
    `).join('') || '';

    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0;">لقد تركت بعض المنتجات الرائعة في سلتك!</h2>
      <p>مرحباً ${customerName}،</p>
      <p>نحن نلاحظ أنك تركت سلة التسوق الخاصة بك قبل إنهاء الطلب. لا داعي للقلق، لقد قمنا بحفظ منتجاتك بأمان لتتمكن من إكمال الشراء بسهولة.</p>
      
      <div style="margin:20px 0; border:1px solid #e2e8f0; border-radius:8px; padding:15px; background-color:#ffffff;">
        <h3 style="margin-top:0; font-size:14px; color:#475569; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">منتجاتك المحفوظة:</h3>
        ${itemsHtml}
        <div style="text-align:left; font-weight:bold; font-size:15px; margin-top:10px; color:#0f172a;">
          المجموع الإجمالي: ${cartTotal.toFixed(2)} د.م
        </div>
      </div>

      <div style="text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/cart" class="btn" target="_blank">العودة إلى السلة وإتمام الطلب</a>
      </div>

      <p style="font-size:13px; color:#64748b;">* الكميات محدودة وقد تنفد بعض المنتجات من المخزون قريباً.</p>
    `;
    return wrapLayout(htmlContent, 'منتجاتك الرائعة في انتظارك لإتمام الطلب - سلة تسوق BioPara');
  },

  // 9. Contact Notification (Sent to Admin)
  contactNotification: (contactData: { name: string; email: string; subject: string; message: string }) => {
    const htmlContent = `
      <h2 style="color:#0f172a; margin-top:0; direction:ltr; text-align:left;">New Contact Message Received</h2>
      <div style="background-color:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0; font-size:13.5px; direction:ltr; text-align:left;">
        <p style="margin:4px 0;"><strong>Name:</strong> ${contactData.name}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${contactData.email}</p>
        <p style="margin:4px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
        <p style="margin:4px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <div style="background-color:#ffffff; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0; font-size:14px; line-height:1.6; direction:ltr; text-align:left;">
        <h3 style="margin-top:0; font-size:14px; color:#475569; border-bottom:1px solid #edf2f7; padding-bottom:8px;">Message Content:</h3>
        <p style="white-space:pre-wrap; margin:0;">${contactData.message}</p>
      </div>

      <div style="text-align:center; margin-top:20px; direction:ltr;">
        <a href="mailto:${contactData.email}?subject=Re: ${encodeURIComponent(contactData.subject)}" class="btn" style="margin:0;">Reply to Customer</a>
      </div>
    `;
    // Admin notification stays in English layout but uses standard header
    return wrapLayout(htmlContent, `New Contact Message: ${contactData.subject}`);
  }
};
