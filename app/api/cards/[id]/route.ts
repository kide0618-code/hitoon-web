import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/cards/:id
 * Get card details with template, artist, and exclusive content info
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createServerSupabaseClient();

    // Get card with related data
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select(`
        *,
        template:card_templates (
          id,
          name,
          artist_image_url,
          song_title,
          subtitle
        ),
        artist:artists (
          id,
          name,
          description,
          image_url,
          member_count
        )
      `)
      .eq('id', id)
      .single();

    if (cardError || !card) {
      if (cardError?.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Card not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching card:', cardError);
      return NextResponse.json(
        { error: 'Failed to fetch card' },
        { status: 500 }
      );
    }

    // Check if current user owns this card (for exclusive content access)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let hasExclusiveAccess = false;
    let exclusiveContents: unknown[] = [];

    if (user) {
      // Check ownership
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('card_id', id)
        .eq('status', 'completed')
        .limit(1)
        .single();

      hasExclusiveAccess = !!purchase;

      if (hasExclusiveAccess) {
        // Get exclusive contents
        const { data: contents } = await supabase
          .from('exclusive_contents')
          .select('*')
          .eq('card_id', id)
          .order('display_order', { ascending: true });

        exclusiveContents = contents || [];
      }
    }

    // Check stock status
    const cardData = card as {
      total_supply: number | null;
      current_supply: number;
      [key: string]: unknown;
    };
    const isSoldOut =
      cardData.total_supply !== null &&
      cardData.current_supply >= cardData.total_supply;

    return NextResponse.json({
      ...cardData,
      is_sold_out: isSoldOut,
      has_exclusive_access: hasExclusiveAccess,
      exclusive_contents: exclusiveContents,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
