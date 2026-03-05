import { createAdminClient } from '@/lib/supabase/server';
import { requireOperator, handleAdminError } from '@/lib/admin/auth';
import type { ArtistInsert } from '@/types/database';
import type { SocialLink } from '@/types/artist';

export async function POST(request: Request) {
  try {
    await requireOperator();

    const body = (await request.json()) as ArtistInsert & { social_links?: SocialLink[] };

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
        note: body.note || null,
        is_featured: body.is_featured || false,
        display_order: body.display_order || 0,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Insert social links if provided
    if (body.social_links && body.social_links.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: linksError } = await (supabaseAdmin.from('artist_social_links') as any).insert(
        body.social_links.map((link, index) => ({
          artist_id: artist.id,
          platform: link.platform,
          url: link.url,
          display_order: index,
        })),
      );

      if (linksError) {
        return Response.json({ error: linksError.message }, { status: 500 });
      }
    }

    return Response.json({ artist });
  } catch (error) {
    return handleAdminError(error);
  }
}
