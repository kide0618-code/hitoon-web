import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';

/**
 * Handle OAuth callback and email confirmation from Supabase Auth
 * Supports both PKCE (code) and token_hash flows
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
  const next = requestUrl.searchParams.get('next') ?? '/';
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors — preserve redirect so user can retry
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    const loginUrl = new URL('/login', requestUrl.origin);
    loginUrl.searchParams.set('error', errorDescription || error);
    if (next !== '/') {
      loginUrl.searchParams.set('redirect', next);
    }
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerSupabaseClient();

  // Handle email confirmation via token_hash (works across browsers)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (verifyError) {
      console.error('Token verification error:', verifyError);
      const loginUrl = new URL('/login', requestUrl.origin);
      loginUrl.searchParams.set('error', verifyError.message);
      if (next !== '/') {
        loginUrl.searchParams.set('redirect', next);
      }
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // Handle OAuth code exchange (PKCE flow)
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      const loginUrl = new URL('/login', requestUrl.origin);
      loginUrl.searchParams.set('error', exchangeError.message);
      if (next !== '/') {
        loginUrl.searchParams.set('redirect', next);
      }
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code or token provided - redirect to login
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}

/**
 * POST /auth/callback
 * Handle cart merge from client-side after login
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItems } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No cart items to merge' });
    }

    // Validate cart items format
    const validItems = cartItems.filter(
      (item: { cardId?: string; quantity?: number }) =>
        item.cardId && typeof item.quantity === 'number' && item.quantity > 0,
    );

    if (validItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No valid cart items' });
    }

    // Convert to the format expected by the merge_cart function
    const itemsForMerge = validItems.map((item: { cardId: string; quantity: number }) => ({
      card_id: item.cardId,
      quantity: Math.min(10, Math.max(1, item.quantity)),
    }));

    // Call the merge_cart function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: mergeError } = await (supabase.rpc as any)('merge_cart', {
      p_user_id: user.id,
      p_items: itemsForMerge,
    });

    if (mergeError) {
      console.error('Cart merge error:', mergeError);
      return NextResponse.json({ error: 'Failed to merge cart' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Merged ${validItems.length} items into cart`,
    });
  } catch (error) {
    console.error('Cart merge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
