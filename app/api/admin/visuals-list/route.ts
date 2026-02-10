import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';

export async function GET() {
  try {
    await requireOperator();

    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: visuals, error } = await (supabaseAdmin.from('card_visuals') as any)
      .select(
        `
        id,
        name,
        artist_id,
        artist:artists (id, name)
      `,
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ visuals });
  } catch (error) {
    return handleAdminError(error);
  }
}
