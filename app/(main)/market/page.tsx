import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Artist, Card } from '@/types/database';
import { MarketClient } from './client';

export const metadata: Metadata = {
  title: 'Store',
  description: 'アーティストのデジタルカードを探す',
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

  // Only return artists that have active cards
  return artistsWithPrices.filter((a) => a.lowestPrice > 0);
}

export default async function MarketPage() {
  const artists = await getArtists();

  return (
    <PageContainer>
      <MarketClient artists={artists} />
    </PageContainer>
  );
}
