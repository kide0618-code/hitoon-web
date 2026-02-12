import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { ArtistUpdate } from '@/types/database';
import type { SocialLink } from '@/types/artist';

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

    // Fetch social links
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: socialLinks } = await (supabaseAdmin.from('artist_social_links') as any)
      .select('platform, url')
      .eq('artist_id', id)
      .order('display_order', { ascending: true });

    return Response.json({ artist, social_links: socialLinks || [] });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireOperator();

    const { id } = await params;
    const body = (await request.json()) as ArtistUpdate & { social_links?: SocialLink[] };

    const supabaseAdmin = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: artist, error } = await (supabaseAdmin.from('artists') as any)
      .update({
        name: body.name,
        description: body.description,
        image_url: body.image_url,
        note: body.note,
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

    // Update social links: delete all then re-insert
    if (body.social_links !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin.from('artist_social_links') as any).delete().eq('artist_id', id);

      if (body.social_links.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: linksError } = await (
          supabaseAdmin.from('artist_social_links') as any
        ).insert(
          body.social_links.map((link, index) => ({
            artist_id: id,
            platform: link.platform,
            url: link.url,
            display_order: index,
          })),
        );

        if (linksError) {
          return Response.json({ error: linksError.message }, { status: 500 });
        }
      }
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
    const { error } = await (supabaseAdmin.from('artists') as any).delete().eq('id', id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
