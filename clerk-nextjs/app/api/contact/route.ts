import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, securityHeaders, validateEmail, sanitizeInput, logSecurityEvent } from '../../../lib/security';

// Contact form API endpoint
export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit('contact')(req);
  if (rateLimitResult.status !== 200) {
    return rateLimitResult;
  }

  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate input
    const errors = [];
    
    if (!name || typeof name !== 'string' || name.length < 2) {
      errors.push('Name is required and must be at least 2 characters');
    }
    
    if (!email || !validateEmail(email)) {
      errors.push('Valid email is required');
    }
    
    if (!subject || typeof subject !== 'string' || subject.length < 3) {
      errors.push('Subject is required and must be at least 3 characters');
    }
    
    if (!message || typeof message !== 'string' || message.length < 10) {
      errors.push('Message is required and must be at least 10 characters');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : '',
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'contact_form_submission',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { email: sanitizedData.email, subject: sanitizedData.subject }
    });

    // In production, send email or save to database
    // For now, just return success
    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully. We will get back to you soon.' 
      },
      {
        status: 200,
        headers: {
          ...securityHeaders(),
          'Content-Type': 'application/json',
        }
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: securityHeaders()
      }
    );
  }
}

// Handle other HTTP methods
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: securityHeaders()
    }
  );
}
