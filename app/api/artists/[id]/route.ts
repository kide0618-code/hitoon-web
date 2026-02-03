import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/artists/:id
 * Get artist details with their card templates and cards
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createServerSupabaseClient();

    // Get artist
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();

    if (artistError) {
      if (artistError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artist not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching artist:', artistError);
      return NextResponse.json(
        { error: 'Failed to fetch artist' },
        { status: 500 }
      );
    }

    // Get templates with cards
    const { data: templates, error: templatesError } = await supabase
      .from('card_templates')
      .select(`
        *,
        cards (
          id,
          name,
          description,
          rarity,
          price,
          total_supply,
          current_supply,
          is_active
        )
      `)
      .eq('artist_id', id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (templatesError) {
      console.error('Error fetching templates:', templatesError);
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...(artist as Record<string, unknown>),
      templates: templates || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
