import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { CardInsert } from '@/types/database';

export async function POST(request: Request) {
  try {
    await requireOperator();

    const body = (await request.json()) as CardInsert;

    // Validate required fields
    if (!body.artist_id) {
      return Response.json({ error: 'Artist ID is required' }, { status: 400 });
    }
    if (!body.name) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    if (body.price !== undefined && body.price < 0) {
      return Response.json({ error: 'Price cannot be negative' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: card, error } = await (supabaseAdmin.from('cards') as any)
      .insert({
        artist_id: body.artist_id,
        name: body.name,
        description: body.description || null,
        rarity: body.rarity || 'NORMAL',
        price: body.price ?? 0,
        total_supply: body.total_supply || null,
        max_purchase_per_user: body.max_purchase_per_user || null,
        card_image_url: body.card_image_url || '',
        song_title: body.song_title || null,
        subtitle: body.subtitle || null,
        frame_template_id: body.frame_template_id || 'normal-frame-radiant',
        is_active: body.is_active ?? true,
        sale_ends_at: body.sale_ends_at || null,
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
