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
    // Note: rarity should not be changed after creation

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

    // Check if card has any purchases
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: purchases } = await (supabaseAdmin.from('purchases') as any)
      .select('id')
      .eq('card_id', id)
      .limit(1);

    if (purchases && purchases.length > 0) {
      return Response.json(
        {
          error: 'Cannot delete card with existing purchases. Deactivate it instead.',
        },
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from('cards') as any).delete().eq('id', id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
