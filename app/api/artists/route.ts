import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/artists
 * Get all artists, optionally filtered by featured status
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('artists')
      .select(
        'id, name, description, image_url, member_count, is_featured, display_order, created_at, updated_at',
      )
      .is('archived_at', null);

    if (featured === 'true') {
      query = query.eq('is_featured', true).order('display_order', { ascending: true });
    } else {
      query = query.order('member_count', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
