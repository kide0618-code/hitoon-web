import type { Metadata } from 'next';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/format';
import type { Artist, Card } from '@/types/database';

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
    .order('member_count', { ascending: false });

  if (error || !data) {
    console.error('Error fetching artists:', error);
    return [];
  }

  const artists = data as Pick<Artist, 'id' | 'name' | 'description' | 'image_url' | 'member_count'>[];

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
    })
  );

  // Only return artists that have active cards
  return artistsWithPrices.filter((a) => a.lowestPrice > 0);
}

export default async function MarketPage() {
  const artists = await getArtists();

  return (
    <PageContainer>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Find Artists</h1>

        <div className="grid grid-cols-1 gap-4">
          {artists.length > 0 ? (
            artists.map((artist) => (
              <Link
                key={artist.id}
                href={ROUTES.ARTIST(artist.id)}
                className="block"
              >
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 flex items-center gap-4 hover:border-blue-500/50 transition-colors">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 flex-shrink-0">
                    <img
                      src={artist.imageUrl || 'https://placehold.co/600x600/1e293b/60a5fa?text=Artist'}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{artist.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Users size={12} className="mr-1" />
                      {artist.memberCount} Members
                    </div>
                    <p className="text-blue-400 font-bold">
                      {formatPrice(artist.lowestPrice)}〜
                    </p>
                  </div>
                  <div className="text-gray-600">→</div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>アーティストがまだ登録されていません。</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
