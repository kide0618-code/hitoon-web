import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout completion
 * - Uses atomic function for serial number assignment
 * - Idempotent via unique constraint on (session_id, card_id, serial_number)
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { user_id, card_id, quantity } = session.metadata || {};

  if (!user_id || !card_id) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  const qty = parseInt(quantity || '1', 10);
  const supabaseAdmin = createAdminClient();

  // Use atomic function to increment supply and get serial numbers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: supplyResult, error: supplyError } = await (supabaseAdmin as any).rpc(
    'increment_card_supply',
    {
      p_card_id: card_id,
      p_quantity: qty,
    }
  ) as { data: { new_supply: number; old_supply: number; card_price: number }[] | null; error: Error | null };

  if (supplyError) {
    console.error('Error incrementing card supply:', supplyError);
    throw supplyError;
  }

  const { old_supply, card_price } = supplyResult?.[0] || { old_supply: 0, card_price: 0 };

  // Create purchase records for each card
  const purchases = [];
  for (let i = 0; i < qty; i++) {
    purchases.push({
      user_id,
      card_id,
      serial_number: old_supply + i + 1,
      quantity_in_order: qty,
      price_paid: card_price,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'completed',
      purchased_at: new Date().toISOString(),
    });
  }

  // Insert purchases (idempotent via unique constraint)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: purchaseError } = await (supabaseAdmin.from('purchases') as any)
    .upsert(purchases, {
      onConflict: 'stripe_checkout_session_id,card_id,serial_number',
      ignoreDuplicates: true,
    });

  if (purchaseError) {
    console.error('Error creating purchase records:', purchaseError);
    throw purchaseError;
  }

  // Update artist member count if this is user's first purchase from this artist
  await updateArtistMemberCount(supabaseAdmin, user_id, card_id);

  console.log(
    `Checkout completed: ${qty} card(s) for user ${user_id}, session ${session.id}`
  );
}

/**
 * Update artist member count for unique purchasers
 */
async function updateArtistMemberCount(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  userId: string,
  cardId: string
) {
  try {
    // Get artist_id from card
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: card } = await (supabaseAdmin.from('cards') as any)
      .select('artist_id')
      .eq('id', cardId)
      .single() as { data: { artist_id: string } | null };

    if (!card?.artist_id) return;

    // Get all card IDs from this artist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: artistCards } = await (supabaseAdmin.from('cards') as any)
      .select('id')
      .eq('artist_id', card.artist_id) as { data: { id: string }[] | null };

    const artistCardIds = artistCards?.map((c) => c.id) || [];

    // Check if user has any other purchases from this artist (excluding current card)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabaseAdmin.from('purchases') as any)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed')
      .neq('card_id', cardId)
      .in('card_id', artistCardIds) as { count: number | null };

    // If this is their first purchase from this artist, increment member count
    if (count === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: artist } = await (supabaseAdmin.from('artists') as any)
        .select('member_count')
        .eq('id', card.artist_id)
        .single() as { data: { member_count: number } | null };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin.from('artists') as any)
        .update({ member_count: (artist?.member_count || 0) + 1 })
        .eq('id', card.artist_id);
    }
  } catch (error) {
    // Non-critical operation, log and continue
    console.error('Error updating artist member count:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  // Could notify user or update pending purchase status
  // For now, just log the failure
}
