import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { ArtistInsert } from '@/types/database';

export async function POST(request: Request) {
  try {
    await requireOperator();

    const body = (await request.json()) as ArtistInsert;

    // Validate required fields
    if (!body.name) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: artist, error } = await (supabaseAdmin.from('artists') as any)
      .insert({
        name: body.name,
        description: body.description || null,
        image_url: body.image_url || null,
        is_featured: body.is_featured || false,
        display_order: body.display_order || 0,
      })
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
