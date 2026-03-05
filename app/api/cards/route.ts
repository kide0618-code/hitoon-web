import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/cards
 * Get all active cards with artist info
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');
    const rarity = searchParams.get('rarity');

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('cards')
      .select(
        `
        *,
        artist:artists (
          id,
          name,
          image_url
        )
      `,
      )
      .eq('is_active', true);

    if (artistId) {
      query = query.eq('artist_id', artistId);
    }

    if (rarity) {
      query = query.eq('rarity', rarity);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cards:', error);
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
