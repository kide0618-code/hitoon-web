import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ArtistDetailClient } from './client';
import type { Rarity } from '@/types/card';
import type { Artist, Card, CardVisual } from '@/types/database';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface CardData {
  id: string;
  rarity: Rarity;
  price: number;
  totalSupply: number | null;
  currentSupply: number;
  visual: {
    artistImageUrl: string;
    songTitle: string | null;
  };
}

interface ArtistData {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  memberCount: number;
  cards: CardData[];
}

async function getArtist(id: string): Promise<ArtistData | null> {
  const supabase = await createServerSupabaseClient();

  // Fetch artist
  const { data: artistData, error: artistError } = await supabase
    .from('artists')
    .select('id, name, description, image_url, member_count')
    .eq('id', id)
    .single();

  if (artistError || !artistData) {
    return null;
  }

  const artist = artistData as Pick<Artist, 'id' | 'name' | 'description' | 'image_url' | 'member_count'>;

  // Fetch cards for this artist
  const { data: cardsData, error: cardsError } = await supabase
    .from('cards')
    .select('id, rarity, price, total_supply, current_supply, visual_id')
    .eq('artist_id', id)
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (cardsError || !cardsData || cardsData.length === 0) {
    return null;
  }

  const cards = cardsData as Pick<Card, 'id' | 'rarity' | 'price' | 'total_supply' | 'current_supply' | 'visual_id'>[];

  // Fetch visual for the first card (all cards share the same visual)
  const { data: visualData } = await supabase
    .from('card_visuals')
    .select('artist_image_url, song_title')
    .eq('id', cards[0].visual_id)
    .single();

  const visual = visualData as Pick<CardVisual, 'artist_image_url' | 'song_title'> | null;

  return {
    id: artist.id,
    name: artist.name,
    description: artist.description,
    imageUrl: artist.image_url,
    memberCount: artist.member_count,
    cards: cards.map((card) => ({
      id: card.id,
      rarity: card.rarity as Rarity,
      price: card.price,
      totalSupply: card.total_supply,
      currentSupply: card.current_supply,
      visual: {
        artistImageUrl: visual?.artist_image_url || artist.image_url || '',
        songTitle: visual?.song_title || null,
      },
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtist(id);

  if (!artist) {
    return { title: 'Artist Not Found' };
  }

  return {
    title: artist.name,
    description: artist.description || `${artist.name}のデジタルカードを購入`,
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

  return <ArtistDetailClient artist={artist} isAuthenticated={!!user} />;
}
