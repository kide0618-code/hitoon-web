import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { APP_CONFIG } from '@/constants/config';
import {
  MusicGroupJsonLd,
  ProductJsonLd,
  BreadcrumbJsonLd,
} from '@/components/seo/json-ld';
import { ArtistDetailClient } from './client';
import type { Rarity } from '@/types/card';
import type { SocialLink } from '@/types/artist';
import type { Artist, Card } from '@/types/database';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface CardData {
  id: string;
  name: string;
  description: string | null;
  rarity: Rarity;
  price: number;
  totalSupply: number | null;
  currentSupply: number;
  cardImageUrl: string;
  songTitle: string | null;
  subtitle: string | null;
  frameTemplateId: string;
  saleEndsAt: string | null;
}

interface ArtistData {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  memberCount: number;
  cards: CardData[];
  socialLinks: SocialLink[];
}

async function getArtist(id: string): Promise<ArtistData | null> {
  const supabase = await createServerSupabaseClient();

  // Fetch artist
  const { data: artistData, error: artistError } = await supabase
    .from('artists')
    .select('id, name, description, image_url, member_count')
    .eq('id', id)
    .is('archived_at', null)
    .single();

  if (artistError || !artistData) {
    return null;
  }

  const artist = artistData as Pick<
    Artist,
    'id' | 'name' | 'description' | 'image_url' | 'member_count'
  >;

  // Fetch cards for this artist (card_image_url, song_title, frame_template_id are now on cards)
  const { data: cardsData, error: cardsError } = await supabase
    .from('cards')
    .select(
      'id, name, description, rarity, price, total_supply, current_supply, card_image_url, song_title, subtitle, frame_template_id, sale_ends_at',
    )
    .eq('artist_id', id)
    .eq('is_active', true)
    .is('archived_at', null)
    .order('price', { ascending: true });

  if (cardsError) {
    console.error('Error fetching cards:', cardsError);
  }

  const cards = (cardsData || []) as Pick<
    Card,
    | 'id'
    | 'name'
    | 'description'
    | 'rarity'
    | 'price'
    | 'total_supply'
    | 'current_supply'
    | 'card_image_url'
    | 'song_title'
    | 'subtitle'
    | 'frame_template_id'
    | 'sale_ends_at'
  >[];

  // Fetch social links
  const { data: socialLinksData } = await supabase
    .from('artist_social_links')
    .select('platform, url')
    .eq('artist_id', id)
    .order('display_order', { ascending: true });

  return {
    id: artist.id,
    name: artist.name,
    description: artist.description,
    imageUrl: artist.image_url,
    memberCount: artist.member_count,
    cards: cards.map((card) => ({
      id: card.id,
      name: card.name,
      description: card.description,
      rarity: card.rarity as Rarity,
      price: card.price,
      totalSupply: card.total_supply,
      currentSupply: card.current_supply,
      cardImageUrl: card.card_image_url || artist.image_url || '',
      songTitle: card.song_title || null,
      subtitle: card.subtitle,
      frameTemplateId: card.frame_template_id,
      saleEndsAt: card.sale_ends_at,
    })),
    socialLinks: (socialLinksData || []) as SocialLink[],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtist(id);

  if (!artist) {
    return { title: 'Artist Not Found' };
  }

  const description = artist.description || `${artist.name}のデジタルカードを購入`;
  const firstCard = artist.cards[0];
  const ogImageUrl = firstCard
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/og/card?id=${firstCard.id}`
    : undefined;

  const cardCount = artist.cards.length;
  const priceRange =
    cardCount > 0
      ? `¥${Math.min(...artist.cards.map((c) => c.price)).toLocaleString()}〜¥${Math.max(...artist.cards.map((c) => c.price)).toLocaleString()}`
      : '';
  const enhancedDescription = `${artist.name}のデジタルトレーディングカード${cardCount > 0 ? `（${cardCount}種類${priceRange ? `・${priceRange}` : ''}）` : ''}をHITOONで購入。${description}`;

  return {
    title: `${artist.name}のデジタルカード`,
    description: enhancedDescription,
    alternates: {
      canonical: `${APP_CONFIG.url}/artists/${id}`,
    },
    openGraph: {
      title: `${artist.name} | ${APP_CONFIG.name}`,
      description: enhancedDescription,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} | ${APP_CONFIG.name}`,
      description: enhancedDescription,
      ...(ogImageUrl && {
        images: [ogImageUrl],
      }),
    },
  };
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Check auth status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const artist = await getArtist(id);

  if (!artist) {
    return notFound();
  }

  const artistUrl = `${APP_CONFIG.url}/artists/${id}`;

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'ホーム', url: APP_CONFIG.url },
          { name: 'ストア', url: `${APP_CONFIG.url}/market` },
          { name: artist.name, url: artistUrl },
        ]}
      />
      <MusicGroupJsonLd
        name={artist.name}
        description={artist.description || `${artist.name}のデジタルカード`}
        imageUrl={artist.imageUrl}
        url={artistUrl}
        memberCount={artist.memberCount}
      />
      {artist.cards.map((card) => {
        const isSoldOut =
          card.totalSupply !== null && card.currentSupply >= card.totalSupply;
        return (
          <ProductJsonLd
            key={card.id}
            name={`${artist.name} - ${card.name}`}
            description={
              card.description ||
              `${artist.name}の${card.rarity}デジタルトレーディングカード`
            }
            imageUrl={card.cardImageUrl}
            price={card.price}
            availability={
              isSoldOut
                ? 'SoldOut'
                : card.totalSupply
                  ? 'LimitedAvailability'
                  : 'InStock'
            }
            artistName={artist.name}
            rarity={card.rarity}
            url={artistUrl}
          />
        );
      })}

      <ArtistDetailClient artist={artist} isAuthenticated={!!user} />
    </>
  );
}
