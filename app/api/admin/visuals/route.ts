import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { CardVisualInsert } from '@/types/database';

interface CreateVisualBody extends CardVisualInsert {
  auto_create_cards?: boolean;
  cards_config?: {
    normal?: { price: number; total_supply: number | null };
    rare?: { price: number; total_supply: number | null };
    super_rare?: { price: number; total_supply: number | null };
  };
}

export async function POST(request: Request) {
  try {
    await requireOperator();

    const body = (await request.json()) as CreateVisualBody;

    // Validate required fields
    if (!body.artist_id) {
      return Response.json({ error: 'Artist ID is required' }, { status: 400 });
    }
    if (!body.name) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.artist_image_url) {
      return Response.json({ error: 'Artist image URL is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Get artist name for card names
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: artist } = await (supabaseAdmin.from('artists') as any)
      .select('name')
      .eq('id', body.artist_id)
      .single();

    if (!artist) {
      return Response.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Create visual
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: visual, error } = await (supabaseAdmin.from('card_visuals') as any)
      .insert({
        artist_id: body.artist_id,
        name: body.name,
        artist_image_url: body.artist_image_url,
        song_title: body.song_title || null,
        subtitle: body.subtitle || null,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Auto-create cards if requested
    if (body.auto_create_cards && body.cards_config) {
      const cardsToCreate = [];
      const config = body.cards_config;

      if (config.normal) {
        cardsToCreate.push({
          visual_id: visual.id,
          artist_id: body.artist_id,
          name: `${artist.name} - NORMAL`,
          rarity: 'NORMAL' as const,
          price: config.normal.price,
          total_supply: config.normal.total_supply,
        });
      }
      if (config.rare) {
        cardsToCreate.push({
          visual_id: visual.id,
          artist_id: body.artist_id,
          name: `${artist.name} - RARE`,
          rarity: 'RARE' as const,
          price: config.rare.price,
          total_supply: config.rare.total_supply,
        });
      }
      if (config.super_rare) {
        cardsToCreate.push({
          visual_id: visual.id,
          artist_id: body.artist_id,
          name: `${artist.name} - SUPER RARE`,
          rarity: 'SUPER_RARE' as const,
          price: config.super_rare.price,
          total_supply: config.super_rare.total_supply,
        });
      }

      if (cardsToCreate.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseAdmin.from('cards') as any).insert(cardsToCreate);
      }
    }

    return Response.json({ visual });
  } catch (error) {
    return handleAdminError(error);
  }
}
