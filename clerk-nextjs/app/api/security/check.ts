import { NextRequest, NextResponse } from 'next/server';
import { securityHeaders, validateEnvironmentVariables } from '@/lib/security';

// Security check endpoint
export async function GET(req: NextRequest) {
  const envValidation = validateEnvironmentVariables();
  
  if (!envValidation.isValid) {
    return NextResponse.json(
      {
        status: 'error',
        issues: envValidation.errors,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: securityHeaders()
      }
    );
  }

  return NextResponse.json(
    {
      status: 'ok',
      message: 'Security check passed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      features: {
        rateLimiting: true,
        securityHeaders: true,
        inputValidation: true,
        csrfProtection: true,
        sessionManagement: true,
      },
    },
    {
      status: 200,
      headers: securityHeaders()
    }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: securityHeaders()
    }
  );
}
