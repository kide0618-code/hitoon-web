import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/artists/:id
 * Get artist details with their cards
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createServerSupabaseClient();

    // Get artist
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select(
        'id, name, description, image_url, member_count, is_featured, display_order, created_at, updated_at',
      )
      .eq('id', id)
      .single();

    if (artistError) {
      if (artistError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
      }
      console.error('Error fetching artist:', artistError);
      return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
    }

    // Get cards directly (no more card_visuals join)
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select(
        `
        id,
        name,
        description,
        rarity,
        price,
        total_supply,
        current_supply,
        card_image_url,
        song_title,
        subtitle,
        frame_template_id,
        is_active
      `,
      )
      .eq('artist_id', id)
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (cardsError) {
      console.error('Error fetching cards:', cardsError);
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }

    return NextResponse.json({
      ...(artist as Record<string, unknown>),
      cards: cards || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
