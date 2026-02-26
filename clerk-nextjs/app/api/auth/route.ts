import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, securityHeaders, generateCSRFToken, validateCSRFToken, hashPassword, logSecurityEvent } from '../../../lib/security';

// In-memory session storage (in production, use database)
const sessions = new Map<string, { userId: string; email: string; expiresAt: number }>();

// Login endpoint
export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit('auth')(req);
  if (rateLimitResult.status !== 200) {
    return rateLimitResult;
  }

  try {
    const body = await req.json();
    const { email, password, csrfToken } = body;

    // Validate CSRF token (if provided)
    if (csrfToken) {
      // In production, validate against session token
      // For now, skip validation
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'login_attempt',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { email }
    });

    // In production, validate against database
    // For demo purposes, accept any email/password
    const hashedPassword = await hashPassword(password);
    
    // Generate session token
    const sessionToken = generateCSRFToken();
    const userId = `user_${Date.now()}`;
    
    // Store session (expires in 24 hours)
    sessions.set(sessionToken, {
      userId,
      email,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: userId,
          email,
        },
        token: sessionToken,
      },
      {
        status: 200,
        headers: {
          ...securityHeaders(),
          'Content-Type': 'application/json',
          'Set-Cookie': `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
        }
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: securityHeaders()
      }
    );
  }
}

// Logout endpoint
export async function DELETE(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const sessionToken = cookieHeader?.match(/session=([^;]+)/)?.[1];

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Remove session
    sessions.delete(sessionToken);

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'logout',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      {
        status: 200,
        headers: {
          ...securityHeaders(),
          'Content-Type': 'application/json',
          'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
        }
      }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: securityHeaders()
      }
    );
  }
}

// Get current user session
export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const sessionToken = cookieHeader?.match(/session=([^;]+)/)?.[1];

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionToken);
    
    // Check if session is expired
    if (!session || Date.now() > session.expiresAt) {
      sessions.delete(sessionToken);
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: session.userId,
          email: session.email,
        }
      },
      {
        status: 200,
        headers: securityHeaders()
      }
    );

  } catch (error) {
    console.error('Session check error:', error);
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
export async function PUT(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: securityHeaders()
    }
  );
}
