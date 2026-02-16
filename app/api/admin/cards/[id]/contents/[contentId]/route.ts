import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';

interface RouteParams {
  params: Promise<{ id: string; contentId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { contentId } = await params;
    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin.from('exclusive_contents') as any)
      .select('*')
      .eq('id', contentId)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json({ content: data });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { contentId } = await params;
    const body = await request.json();
    const supabaseAdmin = createAdminClient();

    const updateData: Record<string, unknown> = {};

    if (body.type !== undefined) updateData.type = body.type;
    if (body.url !== undefined) updateData.url = body.url || null;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.display_order !== undefined) updateData.display_order = body.display_order;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin.from('exclusive_contents') as any)
      .update(updateData)
      .eq('id', contentId)
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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { contentId } = await params;
    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from('exclusive_contents') as any)
      .delete()
      .eq('id', contentId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
