import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { CardUpdate } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: card, error } = await (supabaseAdmin.from('cards') as any)
      .select(
        `
        *,
        artist:artists (id, name),
        exclusive_contents (*)
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json({ card });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const body = (await request.json()) as CardUpdate;

    const supabaseAdmin = createAdminClient();

    // Build update object, only including provided fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.total_supply !== undefined) updateData.total_supply = body.total_supply;
    if (body.max_purchase_per_user !== undefined)
      updateData.max_purchase_per_user = body.max_purchase_per_user;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.card_image_url !== undefined) updateData.card_image_url = body.card_image_url;
    if (body.song_title !== undefined) updateData.song_title = body.song_title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.frame_template_id !== undefined) updateData.frame_template_id = body.frame_template_id;
    if (body.sale_ends_at !== undefined) updateData.sale_ends_at = body.sale_ends_at;

    // Allow artist_id and rarity changes only when no purchases exist (current_supply === 0)
    if (body.artist_id !== undefined || body.rarity !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: currentCard } = await (supabaseAdmin.from('cards') as any)
        .select('current_supply')
        .eq('id', id)
        .single();

      if (currentCard && currentCard.current_supply > 0) {
        if (body.artist_id !== undefined) {
          return Response.json(
            { error: 'Cannot change artist after purchases have been made' },
            { status: 400 },
          );
        }
        if (body.rarity !== undefined) {
          return Response.json(
            { error: 'Cannot change rarity after purchases have been made' },
            { status: 400 },
          );
        }
      }

      if (body.artist_id !== undefined) updateData.artist_id = body.artist_id;
      if (body.rarity !== undefined) updateData.rarity = body.rarity;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: card, error } = await (supabaseAdmin.from('cards') as any)
      .update(updateData)
      .eq('id', id)
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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // Soft delete: set archived_at and deactivate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from('cards') as any)
      .update({
        archived_at: new Date().toISOString(),
        is_active: false,
      })
      .eq('id', id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
