import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/purchases
 * Get current user's purchase history
 */
export async function GET(request: Request) {
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
    const status = searchParams.get('status') || 'completed';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get purchases with card and artist info
    let query = supabase
      .from('purchases')
      .select(
        `
        *,
        card:cards (
          id,
          name,
          description,
          rarity,
          price,
          visual:card_visuals (
            id,
            name,
            artist_image_url,
            song_title
          ),
          artist:artists (
            id,
            name,
            image_url
          )
        )
      `,
      )
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: purchases, error: purchasesError } = await query;

    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
      return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', status === 'all' ? 'completed' : status);

    return NextResponse.json({
      purchases: purchases || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: offset + limit < (count || 0),
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
