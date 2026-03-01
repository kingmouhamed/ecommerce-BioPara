import { NextResponse } from 'next/server';
import emailService from '@/lib/emailService';
import { emailTemplates } from '@/lib/emailTemplates';
import { rateLimitMiddleware } from '@/lib/rateLimiter';

export async function POST(request) {
  try {
    // Rate Limiting - 3 رسائل كل 5 دقائق
    const rateLimitResult = rateLimitMiddleware(request, 3, 300000);
    if (rateLimitResult.error) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: rateLimitResult.message,
          remainingTime: rateLimitResult.remainingTime
        },
        { 
          status: rateLimitResult.status,
          headers: rateLimitResult.headers
        }
      );
    }

    const { name, email, welcomeUrl } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email || !welcomeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and welcomeUrl' },
        { status: 400 }
      );
    }

    // إنشاء محتوى البريد
    const htmlContent = emailTemplates.welcome({ name, email, welcomeUrl });

    // إرسال البريد
    const result = await emailService.sendEmail({
      to: email,
      subject: 'مرحباً بك في BioPara! 🌿',
      html: htmlContent,
      text: `مرحباً ${name}، شكراً لتسجيلك في BioPara! ابدأ التسوق الآن: ${welcomeUrl}`
    });

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Welcome email sent successfully',
          data: result.data 
        },
        { 
          status: 200,
          headers: rateLimitResult.headers
        }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Welcome Email Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
