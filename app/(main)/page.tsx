import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/format';
import type { Artist, Card } from '@/types/database';

interface FeaturedArtist {
  id: string;
  name: string;
  imageUrl: string | null;
  memberCount: number;
  lowestPrice: number;
}

async function getFeaturedArtists(): Promise<FeaturedArtist[]> {
  const supabase = await createServerSupabaseClient();

  // Fetch featured artists
  const { data: artists, error } = await supabase
    .from('artists')
    .select('id, name, image_url, member_count')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(3);

  if (error || !artists) {
    console.error('Error fetching featured artists:', error);
    return [];
  }

  // Fetch lowest price for each artist
  const artistsWithPrices = await Promise.all(
    (artists as Pick<Artist, 'id' | 'name' | 'image_url' | 'member_count'>[]).map(async (artist) => {
      const { data: cards } = await supabase
        .from('cards')
        .select('price')
        .eq('artist_id', artist.id)
        .eq('is_active', true)
        .order('price', { ascending: true })
        .limit(1);

      const cardsList = cards as Pick<Card, 'price'>[] | null;

      return {
        id: artist.id,
        name: artist.name,
        imageUrl: artist.image_url,
        memberCount: artist.member_count,
        lowestPrice: cardsList?.[0]?.price ?? 0,
      };
    })
  );

  // Only return artists that have active cards
  return artistsWithPrices.filter((a) => a.lowestPrice > 0);
}

export default async function HomePage() {
  const featured = await getFeaturedArtists();

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 opacity-60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-transparent to-transparent">
          <h1 className="text-4xl font-extrabold mb-3">{APP_CONFIG.tagline}</h1>
          <Link
            href={ROUTES.MARKET}
            className="w-full sm:w-auto bg-white text-black text-center font-bold py-3 px-8 rounded-full mt-4 inline-block hover:bg-gray-100 transition-colors"
          >
            アーティストを探す
          </Link>
        </div>
      </div>

      {/* Pickup Artists */}
      <section className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
          <Sparkles className="text-yellow-500" />
          Pickup Artists
        </h2>
        <div className="space-y-4">
          {featured.length > 0 ? (
            featured.map((artist) => (
              <Link
                key={artist.id}
                href={ROUTES.ARTIST(artist.id)}
                className="block group"
              >
                <div className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                  <img
                    src={artist.imageUrl || 'https://placehold.co/600x600/1e293b/60a5fa?text=Artist'}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{artist.name}</h3>
                    <p className="text-xs text-gray-500">
                      {artist.memberCount} Members
                    </p>
                  </div>
                  <div className="text-sm font-bold text-blue-400">
                    {formatPrice(artist.lowestPrice)}〜
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              Coming soon...
            </p>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
