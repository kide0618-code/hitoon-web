import type { Metadata } from 'next';
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
    .select(`
      id,
      serial_number,
      purchased_at,
      card_id,
      cards (
        id,
        rarity,
        total_supply,
        artists (
          id,
          name,
          image_url
        ),
        card_visuals (
          song_title
        )
      )
    `)
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
      artists: { id: string; name: string; image_url: string | null } | null;
      card_visuals: { song_title: string | null } | null;
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
  const cardsWithExclusiveContent = new Set(
    exclusiveContents.map((e) => e.card_id)
  );

  // Map to collection items
  return purchases
    .filter((purchase) => purchase.cards !== null)
    .map((purchase) => {
      const card = purchase.cards!;
      const artist = card.artists;
      const visual = card.card_visuals;

      return {
        purchaseId: purchase.id,
        cardId: card.id,
        artistId: artist?.id || '',
        artistName: artist?.name || 'Unknown Artist',
        artistImageUrl:
          artist?.image_url ||
          'https://placehold.co/600x600/1e293b/60a5fa?text=Artist',
        songTitle: visual?.song_title || null,
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
      <div className="p-6 bg-gray-900 border-b border-gray-800 flex items-center gap-3 sticky top-0 z-10">
        <Layers className="text-blue-500" />
        <h1 className="text-2xl font-bold">Collection</h1>
        {/* <span className="text-gray-500 text-sm ml-auto">{collection.length} Cards</span> */}
      </div>

      {/* Collection List */}
      <div className="p-4 space-y-4">
        {collection.map((item) => (
          <Link
            key={item.purchaseId}
            href={ROUTES.COLLECTION_DETAIL(item.purchaseId)}
            className="block group"
          >
            <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 border border-gray-800 group-hover:border-blue-500/50 transition-all shadow-lg active:scale-[0.98]">
              {/* Artist Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={item.artistImageUrl}
                  alt={item.artistName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 border border-black">
                  <ShieldCheck size={12} className="text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold truncate">{item.artistName}</h3>
                  <RarityBadge rarity={item.rarity} />
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  {formatSerialNumber(item.serialNumber)}
                  {item.totalSupply && ` / ${item.totalSupply}`}
                </p>
                {item.hasExclusiveContent && (
                  <div className="mt-2 inline-block px-2 py-0.5 bg-blue-900/30 border border-blue-800/50 rounded text-[10px] text-blue-400 font-bold">
                    CONTENT UNLOCKED
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="text-gray-600 group-hover:text-blue-400 transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        ))}

        {collection.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Layers size={48} className="mx-auto mb-4 opacity-50" />
            <p>まだコレクションがありません。</p>
            <Link
              href={ROUTES.MARKET}
              className="text-blue-400 hover:underline mt-2 inline-block"
            >
              カードを探す →
            </Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
