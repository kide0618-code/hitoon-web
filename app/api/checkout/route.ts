import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  getOrCreateStripeCustomer,
  createCheckoutSession,
  createCartCheckoutSession,
  type CartCheckoutItem,
} from '@/lib/stripe/client';

interface CartItem {
  cardId: string;
  quantity: number;
}

interface CardData {
  id: string;
  name: string;
  price: number;
  total_supply: number | null;
  current_supply: number;
  artist: { id: string; name: string } | null;
  visual: { id: string; name: string; artist_image_url: string | null } | null;
}

/**
 * POST /api/checkout
 * Create Stripe checkout session for card purchase
 * Supports both single card and cart checkout
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Determine if this is a cart checkout (array of items) or single card checkout
    const isCartCheckout = Array.isArray(body.items);

    if (isCartCheckout) {
      return handleCartCheckout(supabase, user, body.items);
    } else {
      return handleSingleCardCheckout(supabase, user, body);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

/**
 * Handle single card checkout (legacy flow)
 */
async function handleSingleCardCheckout(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  user: { id: string; email?: string | null },
  { cardId, quantity = 1 }: { cardId?: string; quantity?: number }
) {
  if (!cardId) {
    return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
  }

  // Validate quantity
  const qty = Math.max(1, Math.min(10, parseInt(String(quantity), 10) || 1));

  // Get card with artist info
  const { data: card, error: cardError } = await supabase
    .from('cards')
    .select(`
      *,
      artist:artists (
        id,
        name
      ),
      visual:card_visuals (
        id,
        name,
        artist_image_url
      )
    `)
    .eq('id', cardId)
    .eq('is_active', true)
    .single();

  if (cardError || !card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const cardData = card as CardData;

  // Check stock availability
  if (cardData.total_supply !== null) {
    const remainingSupply = cardData.total_supply - cardData.current_supply;
    if (remainingSupply <= 0) {
      return NextResponse.json({ error: 'Card is sold out' }, { status: 400 });
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
    imageUrl: cardData.visual?.artist_image_url || undefined,
    price: cardData.price,
    quantity: qty,
    userId: user.id,
    successUrl: `${appUrl}/activity?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${appUrl}/artists/${cardData.artist?.id || ''}`,
  });

  return NextResponse.json({ url: session.url });
}

/**
 * Handle cart checkout (multiple items)
 */
async function handleCartCheckout(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  user: { id: string; email?: string | null },
  items: CartItem[]
) {
  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  // Validate and clamp quantities
  const validatedItems = items.map((item) => ({
    cardId: item.cardId,
    quantity: Math.max(1, Math.min(10, parseInt(String(item.quantity), 10) || 1)),
  }));

  // Get all cards with artist info
  const cardIds = validatedItems.map((item) => item.cardId);
  const { data: cardsData, error: cardsError } = await supabase
    .from('cards')
    .select(`
      id,
      name,
      price,
      total_supply,
      current_supply,
      artist:artists (
        id,
        name
      ),
      visual:card_visuals (
        id,
        name,
        artist_image_url
      )
    `)
    .in('id', cardIds)
    .eq('is_active', true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cards = cardsData as any[] | null;

  if (cardsError || !cards || cards.length === 0) {
    return NextResponse.json({ error: 'Cards not found' }, { status: 404 });
  }

  // Validate stock and build checkout items
  const checkoutItems: CartCheckoutItem[] = [];
  const errors: string[] = [];

  for (const item of validatedItems) {
    const card = cards.find((c: any) => c.id === item.cardId);
    if (!card) {
      errors.push(`Card ${item.cardId} not found`);
      continue;
    }

    const cardData = card as CardData;

    // Check stock availability
    if (cardData.total_supply !== null) {
      const remainingSupply = cardData.total_supply - cardData.current_supply;
      if (remainingSupply <= 0) {
        errors.push(`${cardData.name} is sold out`);
        continue;
      }
      if (item.quantity > remainingSupply) {
        errors.push(`${cardData.name}: only ${remainingSupply} remaining`);
        continue;
      }
    }

    checkoutItems.push({
      cardId: item.cardId,
      cardName: cardData.name,
      artistName: cardData.artist?.name || 'Unknown Artist',
      imageUrl: cardData.visual?.artist_image_url || undefined,
      price: cardData.price,
      quantity: item.quantity,
    });
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: errors.join(', ') },
      { status: 400 }
    );
  }

  if (checkoutItems.length === 0) {
    return NextResponse.json(
      { error: 'No valid items to checkout' },
      { status: 400 }
    );
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomer(user.id, user.email!);

  // Create cart checkout session
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const session = await createCartCheckoutSession({
    customerId,
    items: checkoutItems,
    userId: user.id,
    successUrl: `${appUrl}/activity?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${appUrl}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
