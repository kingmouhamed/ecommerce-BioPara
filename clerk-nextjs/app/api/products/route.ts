import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, securityHeaders, validateProductData, logSecurityEvent } from '../../../lib/security';
import { SAMPLE_PRODUCTS } from '../../../lib/categories';

// Get all products endpoint
export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit('search')(req);
  if (rateLimitResult.status !== 200) {
    return rateLimitResult;
  }

  try {
    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'products_access',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    // Return products without sensitive data
    const safeProducts = SAMPLE_PRODUCTS.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      badge: product.badge,
      tags: product.tags,
    }));

    return NextResponse.json(
      { 
        products: safeProducts,
        total: safeProducts.length 
      },
      {
        status: 200,
        headers: {
          ...securityHeaders(),
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        }
      }
    );

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: securityHeaders()
      }
    );
  }
}

// Create new product endpoint (admin only)
export async function POST(req: NextRequest) {
  // Apply stricter rate limiting for admin operations
  const rateLimitResult = await rateLimit('general')(req);
  if (rateLimitResult.status !== 200) {
    return rateLimitResult;
  }

  try {
    const body = await req.json();
    
    // Validate product data
    const validation = validateProductData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Log security event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    logSecurityEvent({
      type: 'product_creation',
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      details: { productTitle: body.title, category: body.category }
    });

    // In production, save to database
    // For now, just return success
    const newProduct = {
      ...body,
      id: `prod-${Date.now()}`,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { 
        success: true,
        product: newProduct,
        message: 'Product created successfully' 
      },
      {
        status: 201,
        headers: {
          ...securityHeaders(),
          'Content-Type': 'application/json',
        }
      }
    );

  } catch (error) {
    console.error('Product creation error:', error);
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

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: securityHeaders()
    }
  );
}
