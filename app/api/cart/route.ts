import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/cart
 * Fetch user's cart with card details
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cartItems, error } = await (supabase.from('carts') as any)
      .select(
        `
        id,
        user_id,
        card_id,
        quantity,
        added_at,
        card:cards (
          id,
          name,
          price,
          rarity,
          total_supply,
          current_supply,
          visual:card_visuals (
            artist_image_url,
            song_title
          ),
          artist:artists (
            id,
            name
          )
        )
      `,
      )
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart:', error);
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }

    // Transform to expected format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (cartItems || ([] as any[]))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => item.card)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => {
        const card = Array.isArray(item.card) ? item.card[0] : item.card;
        const visual = Array.isArray(card?.visual) ? card.visual[0] : card?.visual;
        const artist = Array.isArray(card?.artist) ? card.artist[0] : card?.artist;

        return {
          id: item.id,
          userId: item.user_id,
          cardId: item.card_id,
          quantity: item.quantity,
          addedAt: item.added_at,
          card: {
            id: card?.id,
            name: card?.name,
            price: card?.price,
            rarity: card?.rarity,
            totalSupply: card?.total_supply,
            currentSupply: card?.current_supply,
            visual: {
              artistImageUrl: visual?.artist_image_url || '',
              songTitle: visual?.song_title || null,
            },
            artist: {
              id: artist?.id || '',
              name: artist?.name || 'Unknown Artist',
            },
          },
        };
      });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Add or update item in cart
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

    const { cardId, quantity = 1 } = await request.json();

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    // Validate quantity
    const qty = Math.max(1, Math.min(10, parseInt(quantity, 10) || 1));

    // Verify card exists and is active
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .select('id, total_supply, current_supply')
      .eq('id', cardId)
      .eq('is_active', true)
      .single();

    const card = cardData as {
      id: string;
      total_supply: number | null;
      current_supply: number;
    } | null;

    if (cardError || !card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Check availability (optional: warn if low stock)
    if (card.total_supply !== null) {
      const remaining = card.total_supply - card.current_supply;
      if (remaining <= 0) {
        return NextResponse.json({ error: 'Card is sold out' }, { status: 400 });
      }
    }

    // Upsert cart item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: upsertError } = await (supabase.from('carts') as any).upsert(
      {
        user_id: user.id,
        card_id: cardId,
        quantity: qty,
      },
      {
        onConflict: 'user_id,card_id',
      },
    );

    if (upsertError) {
      console.error('Error adding to cart:', upsertError);
      return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/cart
 * Remove item from cart
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('carts') as any)
      .delete()
      .eq('user_id', user.id)
      .eq('card_id', cardId);

    if (error) {
      console.error('Error removing from cart:', error);
      return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
