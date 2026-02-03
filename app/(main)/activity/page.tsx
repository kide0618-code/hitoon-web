import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Layers, Clock, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { RarityBadge } from '@/components/cards/rarity-badge';
import { ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate, formatPrice, formatSerialNumber } from '@/lib/utils/format';
import type { Rarity } from '@/types/card';

export const metadata: Metadata = {
  title: 'Activity',
  description: '購入履歴・アクティビティ',
};

interface SearchParams {
  success?: string;
  session_id?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

interface RecentPurchase {
  id: string;
  artistName: string;
  artistImageUrl: string;
  rarity: Rarity;
  serialNumber: number;
  totalSupply: number | null;
  pricePaid: number;
  purchasedAt: string;
}

async function getRecentPurchases(): Promise<RecentPurchase[]> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Fetch recent purchases with all related data in a single query
  const { data: purchasesData, error: purchasesError } = await supabase
    .from('purchases')
    .select(`
      id,
      serial_number,
      price_paid,
      purchased_at,
      card_id,
      cards (
        rarity,
        total_supply,
        artists (
          name,
          image_url
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('purchased_at', { ascending: false })
    .limit(10);

  if (purchasesError || !purchasesData) {
    console.error('Error fetching purchases:', purchasesError);
    return [];
  }

  // Type assertion for the nested query result
  type PurchaseWithRelations = {
    id: string;
    serial_number: number;
    price_paid: number;
    purchased_at: string;
    card_id: string | null;
    cards: {
      rarity: string;
      total_supply: number | null;
      artists: { name: string; image_url: string | null } | null;
    } | null;
  };
  const purchases = purchasesData as PurchaseWithRelations[];

  // Map to RecentPurchase format
  return purchases
    .filter((purchase) => purchase.cards !== null)
    .map((purchase) => {
      const card = purchase.cards!;
      const artist = card.artists;

      return {
        id: purchase.id,
        artistName: artist?.name || 'Unknown',
        artistImageUrl:
          artist?.image_url || 'https://placehold.co/600x600/1e293b/60a5fa?text=Artist',
        rarity: card.rarity as Rarity,
        serialNumber: purchase.serial_number,
        totalSupply: card.total_supply,
        pricePaid: purchase.price_paid,
        purchasedAt: purchase.purchased_at,
      };
    });
}

export default async function ActivityPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isSuccess = params.success === 'true';
  const recentPurchases = await getRecentPurchases();

  return (
    <PageContainer>
      {/* Success Message */}
      {isSuccess && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/50 rounded-2xl p-6 text-center">
            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">購入完了！</h1>
            <p className="text-gray-300 mb-6">
              デジタルカードがコレクションに追加されました。
            </p>
            <Link
              href={ROUTES.COLLECTION}
              className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Layers size={20} />
              コレクションを見る
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 bg-gray-900 border-b border-gray-800 flex items-center gap-3">
        <Clock className="text-blue-500" />
        <h2 className="text-xl font-bold">Recent Activity</h2>
      </div>

      {/* Recent Purchases */}
      <div className="p-4 space-y-3">
        {recentPurchases.length > 0 ? (
          recentPurchases.map((purchase) => (
            <Link
              key={purchase.id}
              href={ROUTES.COLLECTION_DETAIL(purchase.id)}
              className="block group"
            >
              <div className="bg-gray-900/50 rounded-xl p-4 flex items-center gap-4 border border-gray-800 group-hover:border-blue-500/50 transition-all">
                <img
                  src={purchase.artistImageUrl}
                  alt={purchase.artistName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold truncate">{purchase.artistName}</span>
                    <RarityBadge rarity={purchase.rarity} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-mono">
                      {formatSerialNumber(purchase.serialNumber)}
                      {purchase.totalSupply && ` / ${purchase.totalSupply}`}
                    </span>
                    <span>•</span>
                    <span>{formatPrice(purchase.pricePaid)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{formatDate(purchase.purchasedAt)}</p>
                  <ArrowRight size={16} className="text-gray-600 group-hover:text-blue-400 transition-colors ml-auto mt-1" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4">まだ購入履歴がありません。</p>
            <Link
              href={ROUTES.MARKET}
              className="text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              カードを探す <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* CTA to Collection */}
      {recentPurchases.length > 0 && (
        <div className="p-4">
          <Link
            href={ROUTES.COLLECTION}
            className="block w-full text-center py-3 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            すべてのコレクションを見る →
          </Link>
        </div>
      )}
    </PageContainer>
  );
}
