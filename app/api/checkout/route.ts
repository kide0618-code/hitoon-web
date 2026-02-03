import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getOrCreateStripeCustomer, createCheckoutSession } from '@/lib/stripe/client';

/**
 * POST /api/checkout
 * Create Stripe checkout session for card purchase
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { cardId, quantity = 1 } = await request.json();

    if (!cardId) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    // Validate quantity
    const qty = Math.max(1, Math.min(10, parseInt(quantity, 10) || 1));

    // Get card with artist info
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select(`
        *,
        artist:artists (
          id,
          name
        ),
        template:card_templates (
          id,
          name,
          artist_image_url
        )
      `)
      .eq('id', cardId)
      .eq('is_active', true)
      .single();

    if (cardError || !card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Type assertion for card data
    const cardData = card as {
      name: string;
      price: number;
      total_supply: number | null;
      current_supply: number;
      artist: { id: string; name: string } | null;
      template: { id: string; name: string; artist_image_url: string | null } | null;
    };

    // Check stock availability
    if (cardData.total_supply !== null) {
      const remainingSupply = cardData.total_supply - cardData.current_supply;
      if (remainingSupply <= 0) {
        return NextResponse.json(
          { error: 'Card is sold out' },
          { status: 400 }
        );
      }
      if (qty > remainingSupply) {
        return NextResponse.json(
          { error: `Only ${remainingSupply} cards remaining` },
          { status: 400 }
        );
      }
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, user.email!);

    // Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await createCheckoutSession({
      customerId,
      cardId,
      cardName: cardData.name,
      artistName: cardData.artist?.name || 'Unknown Artist',
      imageUrl: cardData.template?.artist_image_url || undefined,
      price: cardData.price,
      quantity: qty,
      userId: user.id,
      successUrl: `${appUrl}/activity?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/artists/${cardData.artist?.id || ''}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
