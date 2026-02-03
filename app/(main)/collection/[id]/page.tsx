import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Play, Music, Image as ImageIcon, ExternalLink, Calendar, Hash } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { ArtistCard } from '@/components/cards/artist-card';
import { RarityBadge } from '@/components/cards/rarity-badge';
import { ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate, formatPrice, formatSerialNumber } from '@/lib/utils/format';
import type { Rarity } from '@/types/card';
import type { Purchase, Card, Artist, CardTemplate, ExclusiveContent as DbExclusiveContent } from '@/types/database';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ExclusiveContent {
  id: string;
  type: 'video' | 'music' | 'image';
  url: string;
  title: string;
  description: string | null;
}

interface PurchaseDetail {
  id: string;
  serialNumber: number;
  pricePaid: number;
  purchasedAt: string;
  card: {
    id: string;
    rarity: Rarity;
    totalSupply: number | null;
    template: {
      artistImageUrl: string;
      songTitle: string | null;
    };
  };
  artist: {
    id: string;
    name: string;
  };
  exclusiveContents: ExclusiveContent[];
}

async function getPurchaseDetail(id: string): Promise<PurchaseDetail | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch purchase
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchases')
    .select('id, serial_number, price_paid, purchased_at, card_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .single();

  if (purchaseError || !purchaseData) {
    return null;
  }

  const purchase = purchaseData as Pick<Purchase, 'id' | 'serial_number' | 'price_paid' | 'purchased_at' | 'card_id'>;

  if (!purchase.card_id) {
    return null;
  }

  // Fetch card
  const { data: cardData } = await supabase
    .from('cards')
    .select('id, rarity, total_supply, artist_id, template_id')
    .eq('id', purchase.card_id)
    .single();

  if (!cardData) {
    return null;
  }

  const card = cardData as Pick<Card, 'id' | 'rarity' | 'total_supply' | 'artist_id' | 'template_id'>;

  // Fetch artist
  const { data: artistData } = await supabase
    .from('artists')
    .select('id, name, image_url')
    .eq('id', card.artist_id)
    .single();

  const artist = artistData as Pick<Artist, 'id' | 'name' | 'image_url'> | null;

  // Fetch template
  const { data: templateData } = await supabase
    .from('card_templates')
    .select('artist_image_url, song_title')
    .eq('id', card.template_id)
    .single();

  const template = templateData as Pick<CardTemplate, 'artist_image_url' | 'song_title'> | null;

  // Fetch exclusive contents
  const { data: contentsData } = await supabase
    .from('exclusive_contents')
    .select('id, type, url, title, description')
    .eq('card_id', card.id)
    .order('display_order', { ascending: true });

  const contents = (contentsData || []) as Pick<DbExclusiveContent, 'id' | 'type' | 'url' | 'title' | 'description'>[];

  return {
    id: purchase.id,
    serialNumber: purchase.serial_number,
    pricePaid: purchase.price_paid,
    purchasedAt: purchase.purchased_at,
    card: {
      id: card.id,
      rarity: card.rarity as Rarity,
      totalSupply: card.total_supply,
      template: {
        artistImageUrl: template?.artist_image_url || artist?.image_url || '',
        songTitle: template?.song_title || null,
      },
    },
    artist: {
      id: artist?.id || '',
      name: artist?.name || 'Unknown Artist',
    },
    exclusiveContents: contents.map((c) => ({
      id: c.id,
      type: c.type as 'video' | 'music' | 'image',
      url: c.url,
      title: c.title,
      description: c.description,
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const purchase = await getPurchaseDetail(id);

  if (!purchase) {
    return { title: 'Card Not Found' };
  }

  return {
    title: `${purchase.artist.name} - Collection`,
    description: `${purchase.artist.name}のデジタルカード #${purchase.serialNumber}`,
  };
}

const contentTypeConfig = {
  video: { icon: Play, label: 'VIDEO', color: 'text-red-400' },
  music: { icon: Music, label: 'MUSIC', color: 'text-green-400' },
  image: { icon: ImageIcon, label: 'IMAGE', color: 'text-blue-400' },
};

export default async function CollectionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const purchase = await getPurchaseDetail(id);

  if (!purchase) {
    return notFound();
  }

  return (
    <PageContainer>
      {/* Back Button */}
      <Link
        href={ROUTES.COLLECTION}
        className="fixed top-4 left-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Card Display */}
      <div className="p-6 pt-16">
        <div className="max-w-xs mx-auto">
          <ArtistCard
            artistName={purchase.artist.name}
            artistImageUrl={purchase.card.template.artistImageUrl}
            songTitle={purchase.card.template.songTitle}
            rarity={purchase.card.rarity}
            serialNumber={purchase.serialNumber}
            totalSupply={purchase.card.totalSupply}
            owned={1}
          />
        </div>
      </div>

      {/* Card Info */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{purchase.artist.name}</h1>
          <RarityBadge rarity={purchase.card.rarity} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Hash size={12} />
              Serial Number
            </div>
            <p className="font-mono font-bold">
              {formatSerialNumber(purchase.serialNumber)}
              {purchase.card.totalSupply && (
                <span className="text-gray-500"> / {purchase.card.totalSupply}</span>
              )}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Calendar size={12} />
              Purchase Date
            </div>
            <p className="font-bold">{formatDate(purchase.purchasedAt)}</p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-500 text-xs mb-1">購入価格</p>
          <p className="font-bold text-lg">{formatPrice(purchase.pricePaid)}</p>
        </div>
      </div>

      {/* Exclusive Content */}
      {purchase.exclusiveContents.length > 0 && (
        <div className="p-6 pt-0">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Exclusive Content
          </h2>

          <div className="space-y-3">
            {purchase.exclusiveContents.map((content) => {
              const config = contentTypeConfig[content.type];
              const Icon = config.icon;

              return (
                <a
                  key={content.id}
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-gray-900 to-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gray-800 ${config.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <h3 className="font-bold truncate">{content.title}</h3>
                      {content.description && (
                        <p className="text-sm text-gray-500 truncate">{content.description}</p>
                      )}
                    </div>
                    <ExternalLink
                      size={20}
                      className="text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* View Artist */}
      <div className="p-6 pt-0">
        <Link
          href={ROUTES.ARTIST(purchase.artist.id)}
          className="block w-full text-center py-3 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          {purchase.artist.name} の他のカードを見る →
        </Link>
      </div>
    </PageContainer>
  );
}
