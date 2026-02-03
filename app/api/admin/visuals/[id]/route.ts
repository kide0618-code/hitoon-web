import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { CardVisualUpdate } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: visual, error } = await (supabaseAdmin.from('card_visuals') as any)
      .select(
        `
        *,
        artist:artists (id, name),
        cards (*)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json({ visual });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const body = (await request.json()) as CardVisualUpdate;

    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: visual, error } = await (supabaseAdmin.from('card_visuals') as any)
      .update({
        name: body.name,
        artist_image_url: body.artist_image_url,
        song_title: body.song_title,
        subtitle: body.subtitle,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ visual });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // Note: This will cascade delete related cards due to FK constraint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from('card_visuals') as any)
      .delete()
      .eq('id', id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
