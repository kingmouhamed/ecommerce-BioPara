// =================================
// CART API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';

// Get supabase client
const supabaseAdmin = getSupabaseAdmin();

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    let cart;

    if (userId) {
      // Get user's cart
      const { data } = await supabaseAdmin
        .from('carts')
        .select(`
          *,
          cart_items (
            *,
            products (
              id,
              name,
              slug,
              price,
              images,
              stock_quantity
            )
          )
        `)
        .eq('user_id', userId)
        .single();

      cart = data;
    } else if (sessionId) {
      // Get guest cart
      const { data } = await supabaseAdmin
        .from('carts')
        .select(`
          *,
          cart_items (
            *,
            products (
              id,
              name,
              slug,
              price,
              images,
              stock_quantity
            )
          )
        `)
        .eq('session_id', sessionId)
        .single();

      cart = data;
    } else {
      return NextResponse.json(
        { success: false, error: 'User ID or Session ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Cart retrieved successfully',
    });
  } catch (error) {
    console.error('Cart API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { action, ...data } = body;

    let result;

    switch (action) {
      case 'add_item':
        result = await addCartItem(data);
        break;

      case 'update_item':
        result = await updateCartItem(data);
        break;

      case 'remove_item':
        result = await removeCartItem(data);
        break;

      case 'clear_cart':
        result = await clearCart(data);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: (result as any).error || 'Unknown error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.cart,
      message: 'Cart operation completed successfully',
    });
  } catch (error) {
    console.error('Cart API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function addCartItem(data: any) {
  const { userId, sessionId, productId, quantity } = data;

  // Get or create cart
  let cart;
  if (userId) {
    const { data: existingCart } = await supabaseAdmin
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingCart) {
      const { data: newCart } = await supabaseAdmin
        .from('carts')
        .insert({
          user_id: userId,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })
        .select()
        .single();

      cart = newCart;
    } else {
      cart = existingCart;
    }
  } else {
    // Guest cart logic
    return { success: false, error: 'Guest cart not implemented yet' };
  }

  // Get product details
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('price, stock_quantity')
    .eq('id', productId)
    .single();

  if (!product) {
    return { success: false, error: 'Product not found' };
  }

  if (product.stock_quantity < quantity) {
    return { success: false, error: 'Insufficient stock' };
  }

  // Add or update cart item
  const { data: cartItem, error } = await supabaseAdmin
    .from('cart_items')
    .upsert({
      cart_id: cart.id,
      product_id: productId,
      quantity,
      unit_price: product.price,
    }, {
      onConflict: 'cart_id,product_id',
      ignoreDuplicates: false,
    })
    .select(`
      *,
      products (
        id,
        name,
        slug,
        price,
        images
      )
    `)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Get updated cart
  const { data: updatedCart } = await supabaseAdmin
    .from('carts')
    .select(`
      *,
      cart_items (
        *,
        products (
          id,
          name,
          slug,
          price,
          images
        )
      )
    `)
    .eq('id', cart.id)
    .single();

  return { success: true, cart: updatedCart };
}

async function updateCartItem(data: any) {
  const { userId, sessionId, productId, quantity } = data;

  // Similar logic to addCartItem but update existing item
  // Implementation details...
  
  return { success: true, cart: null };
}

async function removeCartItem(data: any) {
  const { userId, sessionId, productId } = data;

  // Find cart and remove item
  // Implementation details...
  
  return { success: true, cart: null };
}

async function clearCart(data: any) {
  const { userId, sessionId } = data;

  // Find cart and clear all items
  // Implementation details...
  
  return { success: true, cart: null };
}
