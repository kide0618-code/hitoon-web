import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { APP_CONFIG } from '@/constants/config';
import { ArtistListJsonLd } from '@/components/seo/json-ld';
import type { Artist, Card } from '@/types/database';
import { MarketClient } from './client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ストア - アーティストのデジタルカードを探す',
  description:
    'HITOONストアでお気に入りのアーティストのデジタルトレーディングカードを探そう。NORMAL・RARE・SUPER RAREの限定カードを購入して、コレクションを始めよう。',
  alternates: {
    canonical: `${APP_CONFIG.url}/market`,
  },
};

interface ArtistItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  memberCount: number;
  lowestPrice: number;
}

async function getArtists(): Promise<ArtistItem[]> {
  const supabase = await createServerSupabaseClient();

  // Fetch all artists
  const { data, error } = await supabase
    .from('artists')
    .select('id, name, description, image_url, member_count')
    .is('archived_at', null)
    .order('member_count', { ascending: false });

  if (error || !data) {
    console.error('Error fetching artists:', error);
    return [];
  }

  const artists = data as Pick<
    Artist,
    'id' | 'name' | 'description' | 'image_url' | 'member_count'
  >[];

  // Fetch lowest price for each artist
  const artistsWithPrices = await Promise.all(
    artists.map(async (artist) => {
      const { data: cardsData } = await supabase
        .from('cards')
        .select('price')
        .eq('artist_id', artist.id)
        .eq('is_active', true)
        .is('archived_at', null)
        .order('price', { ascending: true })
        .limit(1);

      const cards = cardsData as Pick<Card, 'price'>[] | null;

      return {
        id: artist.id,
        name: artist.name,
        description: artist.description,
        imageUrl: artist.image_url,
        memberCount: artist.member_count,
        lowestPrice: cards?.[0]?.price ?? 0,
      };
    }),
  );

  return artistsWithPrices;
}

export default async function MarketPage() {
  const artists = await getArtists();

  return (
    <PageContainer>
      <ArtistListJsonLd
        artists={artists.map((a, i) => ({
          id: a.id,
          name: a.name,
          imageUrl: a.imageUrl,
          position: i + 1,
        }))}
      />
      <MarketClient artists={artists} />
    </PageContainer>
  );
}
