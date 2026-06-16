import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Admin Delete Product Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
