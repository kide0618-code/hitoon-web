import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { RarityBadge } from '@/components/cards/rarity-badge';
import { ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatSerialNumber } from '@/lib/utils/format';
import type { Rarity } from '@/types/card';

export const metadata: Metadata = {
  title: 'Collection',
  description: 'あなたのカードコレクション',
};

interface CollectionItem {
  purchaseId: string;
  cardId: string;
  artistId: string;
  artistName: string;
  artistImageUrl: string;
  songTitle: string | null;
  rarity: Rarity;
  serialNumber: number;
  totalSupply: number | null;
  hasExclusiveContent: boolean;
  purchasedAt: string;
}

async function getCollection(): Promise<CollectionItem[]> {
  const supabase = await createServerSupabaseClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch purchases with all related data in a single query using Supabase relations
  const { data: purchasesData, error: purchasesError } = await supabase
    .from('purchases')
    .select(
      `
      id,
      serial_number,
      purchased_at,
      card_id,
      cards (
        id,
        rarity,
        total_supply,
        song_title,
        artists (
          id,
          name,
          image_url
        )
      )
    `,
    )
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('purchased_at', { ascending: false });

  if (purchasesError || !purchasesData) {
    console.error('Error fetching purchases:', purchasesError);
    return [];
  }

  // Type assertion for the nested query result
  type PurchaseWithRelations = {
    id: string;
    serial_number: number;
    purchased_at: string;
    card_id: string | null;
    cards: {
      id: string;
      rarity: string;
      total_supply: number | null;
      song_title: string | null;
      artists: { id: string; name: string; image_url: string | null } | null;
    } | null;
  };
  const purchases = purchasesData as PurchaseWithRelations[];

  // Get unique card IDs for batch exclusive content check
  const cardIds = purchases
    .map((p) => p.cards?.id)
    .filter((id): id is string => id !== undefined && id !== null);

  // Batch fetch exclusive content counts (single query instead of N queries)
  const { data: exclusiveData } = await supabase
    .from('exclusive_contents')
    .select('card_id')
    .in('card_id', cardIds.length > 0 ? cardIds : ['']);

  const exclusiveContents = (exclusiveData || []) as { card_id: string }[];
  const cardsWithExclusiveContent = new Set(exclusiveContents.map((e) => e.card_id));

  // Map to collection items
  return purchases
    .filter((purchase) => purchase.cards !== null)
    .map((purchase) => {
      const card = purchase.cards!;
      const artist = card.artists;

      return {
        purchaseId: purchase.id,
        cardId: card.id,
        artistId: artist?.id || '',
        artistName: artist?.name || 'Unknown Artist',
        artistImageUrl:
          artist?.image_url || 'https://placehold.co/600x600/1e293b/60a5fa?text=Artist',
        songTitle: card.song_title || null,
        rarity: card.rarity as Rarity,
        serialNumber: purchase.serial_number,
        totalSupply: card.total_supply,
        hasExclusiveContent: cardsWithExclusiveContent.has(card.id),
        purchasedAt: purchase.purchased_at,
      };
    });
}

export default async function CollectionPage() {
  const collection = await getCollection();

  return (
    <PageContainer>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-800 bg-gray-900 p-6">
        <Layers className="text-blue-500" />
        <h1 className="text-2xl font-bold">Collection</h1>
        {/* <span className="text-gray-500 text-sm ml-auto">{collection.length} Cards</span> */}
      </div>

      {/* Collection List */}
      <div className="space-y-4 p-4">
        {collection.map((item) => {
          // Rarity-based accent colors
          const rarityAccent =
            {
              NORMAL: 'border-l-rarity-normal',
              RARE: 'border-l-rarity-rare',
              SUPER_RARE: 'border-l-rarity-sr',
            }[item.rarity] || 'border-l-gray-500';

          return (
            <Link
              key={item.purchaseId}
              href={ROUTES.COLLECTION_DETAIL(item.purchaseId)}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div
                className={`flex items-center gap-4 rounded-xl border border-l-4 border-gray-800 bg-surface-raised p-4 ${rarityAccent} shadow-card transition-all active:scale-[0.98] group-hover:border-blue-500/50 group-hover:border-l-blue-500`}
              >
                {/* Artist Image */}
                <div className="relative flex-shrink-0">
                  <Image
                    src={item.artistImageUrl}
                    alt={item.artistName}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full border-2 border-blue-500/30 object-cover transition-colors group-hover:border-blue-500/60"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full border border-black bg-blue-600 p-0.5">
                    <ShieldCheck size={12} className="text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <h3 className="truncate font-bold">{item.artistName}</h3>
                    <RarityBadge rarity={item.rarity} />
                  </div>
                  <p className="font-mono text-2xs uppercase tracking-widest text-gray-500">
                    {formatSerialNumber(item.serialNumber)}
                    {item.totalSupply && ` / ${item.totalSupply}`}
                  </p>
                  {item.hasExclusiveContent && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 px-2.5 py-1 text-2xs font-bold text-blue-300">
                      <ShieldCheck size={10} />
                      CONTENT UNLOCKED
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="text-gray-600 transition-colors group-hover:text-blue-400">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          );
        })}

        {collection.length === 0 && (
          <div className="py-20 text-center">
            <div className="relative mx-auto mb-6 h-24 w-24">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-surface-raised">
                <Layers size={40} className="text-gray-500" />
              </div>
            </div>
            <p className="mb-2 text-lg font-bold text-gray-400">コレクションは空です</p>
            <p className="mb-6 text-sm text-gray-500">
              お気に入りのアーティストのカードを集めましょう
            </p>
            <Link
              href={ROUTES.MARKET}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:scale-[1.02] hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              カードを探す
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
