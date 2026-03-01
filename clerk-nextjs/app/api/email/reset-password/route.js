import { NextResponse } from 'next/server';
import emailService from '@/lib/emailService';
import { emailTemplates } from '@/lib/emailTemplates';

export async function POST(request) {
  try {
    const { name, email, resetUrl, token } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email || !resetUrl || !token) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, resetUrl, and token' },
        { status: 400 }
      );
    }

    // إنشاء محتوى البريد
    const htmlContent = emailTemplates.passwordReset({ 
      name, 
      resetUrl, 
      token 
    });

    // إرسال البريد
    const result = await emailService.sendEmail({
      to: email,
      subject: 'استعادة كلمة المرور - BioPara 🔑',
      html: htmlContent,
      text: `مرحباً ${name}، رمز استعادة كلمة المرور الخاص بك هو: ${token}. الرابط: ${resetUrl}`
    });

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Password reset email sent successfully',
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
    console.error('Password Reset Email Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
