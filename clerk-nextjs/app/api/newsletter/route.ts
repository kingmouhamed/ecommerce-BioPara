import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, securityHeaders, validateEmail, sanitizeInput, logSecurityEvent } from '@/lib/security';

// Newsletter subscription endpoint
export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit('general')(req);
  if (rateLimitResult.status !== 200) {
    return rateLimitResult;
  }

  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedEmail = sanitizeInput(email);

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'newsletter_subscription',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { email: sanitizedEmail }
    });

    // In production, save to database and send confirmation email
    // For now, just return success
    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully subscribed to newsletter!' 
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
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: securityHeaders()
      }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit('general')(req);
  if (rateLimitResult.status !== 200) {
    return rateLimitResult;
  }

  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedEmail = sanitizeInput(email);

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'newsletter_unsubscription',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { email: sanitizedEmail }
    });

    // In production, remove from database
    // For now, just return success
    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully unsubscribed from newsletter' 
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
    console.error('Newsletter unsubscription error:', error);
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

export async function PUT(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: securityHeaders()
    }
  );
}
