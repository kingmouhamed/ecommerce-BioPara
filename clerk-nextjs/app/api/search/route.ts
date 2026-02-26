import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, securityHeaders, logSecurityEvent } from '../../../lib/security';
import { SAMPLE_PRODUCTS } from '../../../lib/categories';

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
    const offset = parseInt(searchParams.get('offset') || '0');

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'search_query',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { query, category, limit, offset }
    });

    // Filter products based on search criteria
    let filteredProducts = SAMPLE_PRODUCTS;

    if (query) {
      const searchLower = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower))
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === category
      );
    }

    // Apply pagination
    const startIndex = offset;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        products: paginatedProducts,
        total: filteredProducts.length,
        query,
        category,
        limit,
        offset,
        hasMore: endIndex < filteredProducts.length
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
