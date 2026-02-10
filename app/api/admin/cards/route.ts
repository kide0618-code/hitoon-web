import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { CardInsert } from '@/types/database';

export async function POST(request: Request) {
  try {
    await requireOperator();

    const body = (await request.json()) as CardInsert;

    // Validate required fields
    if (!body.visual_id) {
      return Response.json({ error: 'Visual ID is required' }, { status: 400 });
    }
    if (!body.artist_id) {
      return Response.json({ error: 'Artist ID is required' }, { status: 400 });
    }
    if (!body.name) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    if (body.price === undefined || body.price < 0) {
      return Response.json({ error: 'Valid price is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Check for duplicate rarity in same visual
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingCard } = await (supabaseAdmin.from('cards') as any)
      .select('id')
      .eq('visual_id', body.visual_id)
      .eq('rarity', body.rarity || 'NORMAL')
      .single();

    if (existingCard) {
      return Response.json(
        { error: 'A card with this rarity already exists for this visual' },
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: card, error } = await (supabaseAdmin.from('cards') as any)
      .insert({
        visual_id: body.visual_id,
        artist_id: body.artist_id,
        name: body.name,
        description: body.description || null,
        rarity: body.rarity || 'NORMAL',
        price: body.price,
        total_supply: body.total_supply || null,
        max_purchase_per_user: body.max_purchase_per_user || null,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ card });
  } catch (error) {
    return handleAdminError(error);
  }
}
