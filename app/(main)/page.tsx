export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/format';
import { ArtistListJsonLd, FaqJsonLd } from '@/components/seo/json-ld';
import type { Artist, Card } from '@/types/database';

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
  description:
    'HITOONは、アーティストのデジタルトレーディングカードを購入・コレクションできるプラットフォームです。NORMAL・RARE・SUPER RAREの3種類のレアリティで、限定コンテンツ付きの特別なカードを手に入れよう。',
  alternates: {
    canonical: APP_CONFIG.url,
  },
};

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
    .is('archived_at', null)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(3);

  if (error || !artists) {
    console.error('Error fetching featured artists:', error);
    return [];
  }

  // Fetch lowest price for each artist
  const artistsWithPrices = await Promise.all(
    (artists as Pick<Artist, 'id' | 'name' | 'image_url' | 'member_count'>[]).map(
      async (artist) => {
        const { data: cards } = await supabase
          .from('cards')
          .select('price')
          .eq('artist_id', artist.id)
          .eq('is_active', true)
          .is('archived_at', null)
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
      },
    ),
  );

  return artistsWithPrices;
}

export default async function HomePage() {
  const featured = await getFeaturedArtists();

  return (
    <PageContainer>
      {/* JSON-LD: Featured artist list */}
      {featured.length > 0 && (
        <ArtistListJsonLd
          artists={featured.map((a, i) => ({
            id: a.id,
            name: a.name,
            imageUrl: a.imageUrl,
            position: i + 1,
          }))}
        />
      )}
      <FaqJsonLd
        items={[
          {
            question: 'HITOONとは何ですか？',
            answer:
              'HITOONは、アーティストのデジタルトレーディングカードを購入・コレクションできるプラットフォームです。NORMAL・RARE・SUPER RAREの3種類のレアリティがあり、購入者限定の特別コンテンツにもアクセスできます。',
          },
          {
            question: 'どのような支払い方法がありますか？',
            answer:
              'クレジットカード、Apple Pay、Google Payに対応しています。Stripeによる安全な決済システムを採用しています。',
          },
          {
            question: 'デジタルカードのレアリティとは？',
            answer:
              'カードには3種類のレアリティがあります。NORMAL（¥800〜¥1,500）は無制限発行、RARE（¥1,500〜¥3,000）は100〜300枚限定、SUPER RARE（¥3,000〜¥10,000）は10〜50枚限定です。レアリティが高いほど特別なエフェクトや限定コンテンツが付きます。',
          },
          {
            question: '限定コンテンツとは何ですか？',
            answer:
              'カードを購入すると、アーティストの限定動画、音楽、画像などの特別コンテンツにアクセスできます。購入者だけが閲覧できる独占コンテンツです。',
          },
        ]}
      />

      {/* Hero Section with animated gradient */}
      <div className="relative h-96 w-full overflow-hidden bg-surface">
        {/* Animated gradient background */}
        <div className="animate-gradient-slow absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent p-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-400">HITOON</p>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            {APP_CONFIG.tagline}
          </h1>
          <Link
            href={ROUTES.MARKET}
            className="mt-2 inline-block w-full rounded-full bg-white px-8 py-3 text-center font-bold text-black transition-all hover:scale-[1.02] hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
          >
            アーティストを探す
          </Link>
        </div>
      </div>

      {/* Pickup Artists */}
      <section className="p-6">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
          <Sparkles className="text-yellow-500" />
          Pickup Artists
        </h2>
        <div className="space-y-4">
          {featured.length > 0 ? (
            featured.map((artist) => (
              <Link
                key={artist.id}
                href={ROUTES.ARTIST(artist.id)}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="group-hover:shadow-glow-blue/20 flex items-center gap-4 rounded-xl border border-gray-800 bg-surface-raised p-4 transition-all hover:border-blue-500/50">
                  <Image
                    src={
                      artist.imageUrl || 'https://placehold.co/600x600/1e293b/60a5fa?text=Artist'
                    }
                    alt={artist.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full border-2 border-gray-700 object-cover transition-colors group-hover:border-blue-500/50"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold">{artist.name}</h3>
                    <p className="text-xs text-gray-500">{artist.memberCount} Members</p>
                  </div>
                  <div className="text-base font-bold text-blue-400">
                    {artist.lowestPrice > 0 ? `${formatPrice(artist.lowestPrice)}〜` : 'Coming Soon'}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center">
              <Sparkles className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="mb-2 text-gray-500">Coming soon...</p>
              <p className="text-xs text-gray-600">新しいアーティストを準備中です</p>
            </div>
          )}
        </div>
      </section>

      {/* LLMO / SEO: Semantic content section - visible to crawlers and LLMs */}
      <section className="border-t border-gray-800 p-6" aria-label="HITOONについて">
        <h2 className="mb-4 text-lg font-bold">HITOONとは</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-400">
          HITOONは、アーティストのデジタルトレーディングカードを購入・コレクションできるプラットフォームです。
          「音楽を、一生モノにする。」をコンセプトに、お気に入りのアーティストの限定デジタルカードを手に入れることができます。
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <h3 className="mb-2 text-sm font-bold">3種類のレアリティ</h3>
            <p className="text-xs text-gray-500">
              NORMAL・RARE・SUPER
              RAREの3段階。レアリティに応じた限定枚数とエフェクトで特別感を演出。
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <h3 className="mb-2 text-sm font-bold">限定コンテンツ</h3>
            <p className="text-xs text-gray-500">
              カード購入者だけがアクセスできる限定動画、音楽、画像などの特別コンテンツ。
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <h3 className="mb-2 text-sm font-bold">安全な決済</h3>
            <p className="text-xs text-gray-500">
              Stripe決済でクレジットカード、Apple Pay、Google
              Payに対応。安心してお買い物できます。
            </p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
