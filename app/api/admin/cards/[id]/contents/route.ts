import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin.from('exclusive_contents') as any)
      .select('*')
      .eq('card_id', id)
      .order('display_order', { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ contents: data });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const body = await request.json();
    const supabaseAdmin = createAdminClient();

    const { type, url, title, description, display_order } = body;

    if (!type || !title) {
      return Response.json({ error: 'type and title are required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin.from('exclusive_contents') as any)
      .insert({
        card_id: id,
        type,
        url: url || '',
        title,
        description: description || null,
        display_order: display_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ content: data });
  } catch (error) {
    return handleAdminError(error);
  }
}
