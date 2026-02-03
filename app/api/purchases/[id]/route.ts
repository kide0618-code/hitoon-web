import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/purchases/:id
 * Get specific purchase details with exclusive content access
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createServerSupabaseClient();

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

    // Get purchase with full card, visual, artist info
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select(`
        *,
        card:cards (
          *,
          visual:card_visuals (
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
            image_url
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (purchaseError || !purchase) {
      if (purchaseError?.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Purchase not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching purchase:', purchaseError);
      return NextResponse.json(
        { error: 'Failed to fetch purchase' },
        { status: 500 }
      );
    }

    // Type assertion for purchase data
    const purchaseData = purchase as {
      card_id: string | null;
      [key: string]: unknown;
    };

    // Get exclusive contents for this card (user owns it)
    let exclusiveContents: unknown[] = [];
    if (purchaseData.card_id) {
      const { data: contents } = await supabase
        .from('exclusive_contents')
        .select('*')
        .eq('card_id', purchaseData.card_id)
        .order('display_order', { ascending: true });
      exclusiveContents = contents || [];
    }

    return NextResponse.json({
      ...purchaseData,
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
