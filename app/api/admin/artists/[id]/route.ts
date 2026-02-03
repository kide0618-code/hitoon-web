import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { ArtistUpdate } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: artist, error } = await (supabaseAdmin.from('artists') as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json({ artist });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const body = (await request.json()) as ArtistUpdate;

    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: artist, error } = await (supabaseAdmin.from('artists') as any)
      .update({
        name: body.name,
        description: body.description,
        image_url: body.image_url,
        is_featured: body.is_featured,
        display_order: body.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ artist });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from('artists') as any)
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
