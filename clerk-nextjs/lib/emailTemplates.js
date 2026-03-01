export const emailTemplates = {
  /**
   * قالب رسالة الترحيب
   * @param {Object} data - بيانات المستخدم
   * @param {string} data.name - اسم المستخدم
   * @param {string} data.email - بريد المستخدم
   * @param {string} data.welcomeUrl - رابط الترحيب
   */
  welcome: ({ name, email, welcomeUrl }) => `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>مرحباً بك في BioPara</title>
      <style>
        body { font-family: 'Tajawal', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .welcome-message { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .button:hover { background: #059669; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0; color: #6b7280; font-size: 14px; }
        .info-box { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .social-links { margin: 20px 0; text-align: center; }
        .social-links a { margin: 0 10px; color: #10b981; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 BioPara</h1>
        </div>
        
        <div class="content">
          <h2>مرحباً بك ${name}! 🎉</h2>
          
          <div class="welcome-message">
            <p>شكراً لتسجيلك في BioPara! نحن سعداء بانضمامك لعائلتنا.</p>
            <p>بريدك: <strong>${email}</strong></p>
          </div>

          <div class="info-box">
            <p><strong>معلومات حسابك:</strong></p>
            <p>📧 البريد: ${email}</p>
            <p>🔐 الحالة: مُفعّل</p>
            <p>🎁 خصم ترحيبي: استخدم كود <strong>WELCOME10</strong></p>
          </div>

          <p>الآن يمكنك استكشاف مجموعتنا المميزة من المنتجات الطبيعية:</p>
          <ul>
            <li>🍯 عسل طبيعي 100%</li>
            <li>🌿 أعشاب طبية</li>
            <li>🫙 زيوت طبية</li>
            <li>💊 مكملات غذائية</li>
          </ul>

          <div style="text-align: center;">
            <a href="${welcomeUrl}" class="button">ابدأ التسوق الآن</a>
          </div>

          <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.</p>
        </div>

        <div class="footer">
          <p>مع أطيب التحيات،</p>
          <p><strong>فريق BioPara</strong></p>
          
          <div class="social-links">
            <a href="#">📧 البريد</a>
            <a href="#">📱 واتساب</a>
            <a href="#">🌐 الموقع</a>
          </div>
          
          <p style="margin-top: 15px; font-size: 12px;">
            © 2024 BioPara. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * قالب التحقق من البريد الإلكتروني
   * @param {Object} data - بيانات التحقق
   * @param {string} data.name - اسم المستخدم
   * @param {string} data.verificationUrl - رابط التحقق
   * @param {string} data.token - رمز التحقق
   */
  emailVerification: ({ name, verificationUrl, token }) => `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تحقق من بريدك الإلكتروني - BioPara</title>
      <style>
        body { font-family: 'Tajawal', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .verification-box { background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .button:hover { background: #1d4ed8; }
        .token-box { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center; }
        .token { font-family: monospace; font-size: 18px; font-weight: bold; color: #3b82f6; letter-spacing: 2px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0; color: #6b7280; font-size: 14px; }
        .warning { background: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 BioPara</h1>
        </div>
        
        <div class="content">
          <h2>تحقق من بريدك الإلكتروني</h2>
          
          <p>مرحباً ${name}،</p>
          <p>شكراً لتسجيلك في BioPara. لإكمال عملية التسجيل، يرجى التحقق من بريدك الإلكتروني.</p>

          <div class="verification-box">
            <p><strong>للتحقق من بريدك، انقر على الزر أدناه:</strong></p>
            <a href="${verificationUrl}" class="button">تحقق من البريد الإلكتروني</a>
          </div>

          <div class="token-box">
            <p><strong>أو أدخل الرمز يدوياً:</strong></p>
            <div class="token">${token}</div>
          </div>

          <div class="warning">
            <p><strong>⚠️ ملاحظة هامة:</strong></p>
            <p>• هذا الرمز صالح لمدة 15 دقيقة فقط</p>
            <p>• إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة</p>
            <p>• لا تشارك هذا الرمز مع أي شخص</p>
          </div>

          <p>إذا واجهت أي مشكلة في التحقق، يرجى التواصل مع فريق الدعم.</p>
        </div>

        <div class="footer">
          <p>مع أطيب التحيات،</p>
          <p><strong>فريق BioPara</strong></p>
          
          <p style="margin-top: 15px; font-size: 12px;">
            © 2024 BioPara. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * قالب استعادة كلمة المرور
   * @param {Object} data - بيانات الاستعادة
   * @param {string} data.name - اسم المستخدم
   * @param {string} data.resetUrl - رابط إعادة التعيين
   * @param {string} data.token - رمز الاستعادة
   */
  passwordReset: ({ name, resetUrl, token }) => `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>استعادة كلمة المرور - BioPara</title>
      <style>
        body { font-family: 'Tajawal', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .reset-box { background: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .button:hover { background: #dc2626; }
        .token-box { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center; }
        .token { font-family: monospace; font-size: 18px; font-weight: bold; color: #ef4444; letter-spacing: 2px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0; color: #6b7280; font-size: 14px; }
        .security-tips { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .steps { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 BioPara</h1>
        </div>
        
        <div class="content">
          <h2>استعادة كلمة المرور</h2>
          
          <p>مرحباً ${name}،</p>
          <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك في BioPara.</p>

          <div class="reset-box">
            <p><strong>لإعادة تعيين كلمة المرور، انقر على الزر أدناه:</strong></p>
            <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
          </div>

          <div class="token-box">
            <p><strong>أو أدخل رمز الاستعادة:</strong></p>
            <div class="token">${token}</div>
          </div>

          <div class="steps">
            <p><strong>خطوات إعادة تعيين كلمة المرور:</strong></p>
            <ol>
              <li>انقر على الرابط أعلاه أو أدخل الرمز</li>
              <li>أدخل كلمة مرور جديدة</li>
              <li>تأكيد كلمة المرور الجديدة</li>
              <li>سجل دخولك باستخدام كلمة المرور الجديدة</li>
            </ol>
          </div>

          <div class="security-tips">
            <p><strong>🔒 نصائح أمنية:</strong></p>
            <ul>
              <li>اختر كلمة مرور قوية تحتوي على أحرف كبيرة، صغيرة، أرقام، ورموز</li>
              <li>لا تستخدم كلمة المرور نفسها في مواقع أخرى</li>
              <li>هذا الرمز صالح لمدة ساعة واحدة فقط</li>
              <li>إذا لم تطلب استعادة كلمة المرور، يرجى التواصل معنا فورًا</li>
            </ul>
          </div>

          <p>إذا واجهت أي مشكلة، يرجى التواصل مع فريق الدعم.</p>
        </div>

        <div class="footer">
          <p>مع أطيب التحيات،</p>
          <p><strong>فريق BioPara</strong></p>
          
          <p style="margin-top: 15px; font-size: 12px;">
            © 2024 BioPara. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
};
