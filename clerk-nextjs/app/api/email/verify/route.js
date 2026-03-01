import { NextResponse } from 'next/server';
import emailService from '@/lib/emailService';
import { emailTemplates } from '@/lib/emailTemplates';

export async function POST(request) {
  try {
    const { name, email, verificationUrl, token } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email || !verificationUrl || !token) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, verificationUrl, and token' },
        { status: 400 }
      );
    }

    // إنشاء محتوى البريد
    const htmlContent = emailTemplates.emailVerification({ 
      name, 
      verificationUrl, 
      token 
    });

    // إرسال البريد
    const result = await emailService.sendEmail({
      to: email,
      subject: 'تحقق من بريدك الإلكتروني - BioPara 🔐',
      html: htmlContent,
      text: `مرحباً ${name}، رمز التحقق الخاص بك هو: ${token}. الرابط: ${verificationUrl}`
    });

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Verification email sent successfully',
          data: result.data 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Verification Email Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
