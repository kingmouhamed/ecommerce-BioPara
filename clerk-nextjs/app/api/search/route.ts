import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, securityHeaders, logSecurityEvent } from '@/lib/security';
import { searchProducts } from '@/lib/data/products';

// Search products endpoint
export async function GET(req: NextRequest) {
  // Apply rate limiting for search
  const rateLimitResult = await rateLimit('search')(req);
  if (rateLimitResult.status !== 200) {
    return rateLimitResult;
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'search_query',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { query, category, limit, page }
    });

    const productsData = await searchProducts(query, page, limit);

    return NextResponse.json(
      {
        products: productsData.products,
        total: productsData.pagination.totalCount,
        query,
        category,
        limit,
        page,
        hasMore: productsData.pagination.hasNextPage
      },
      {
        status: 200,
        headers: {
          ...securityHeaders(),
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        }
      }
    );

  } catch (error) {
    console.error('Search API error:', error);
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
export async function POST(req: NextRequest) {
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

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: securityHeaders()
    }
  );
}
