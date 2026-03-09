import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/constants/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Artist } from '@/types/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  // Fetch all active artists
  const { data: artists } = await supabase
    .from('artists')
    .select('id, updated_at')
    .is('archived_at', null) as { data: Pick<Artist, 'id' | 'updated_at'>[] | null };

  const baseUrl = APP_CONFIG.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/market`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-of-sale`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Dynamic artist pages
  const artistPages: MetadataRoute.Sitemap = (artists || []).map((artist) => ({
    url: `${baseUrl}/artists/${artist.id}`,
    lastModified: new Date(artist.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...artistPages];
}
