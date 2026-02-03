'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { ArtistCard } from '@/components/cards/artist-card';
import { CardGrid } from '@/components/cards/card-grid';
import { ROUTES } from '@/constants/routes';
import { formatPrice } from '@/lib/utils/format';
import PurchaseAgreement from '@/components/PurchaseAgreement';
import type { Rarity } from '@/types/card';

interface CardData {
  id: string;
  rarity: Rarity;
  price: number;
  totalSupply: number | null;
  currentSupply: number;
  template: {
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

interface Props {
  artist: ArtistData;
  isAuthenticated: boolean;
}

export function ArtistDetailClient({ artist, isAuthenticated }: Props) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const selectedCardData = artist.cards.find((c) => c.id === selectedCard);

  return (
    <PageContainer>
      {/* Back Button */}
      <Link
        href={ROUTES.MARKET}
        className="fixed top-4 left-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Artist Header */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={artist.imageUrl || 'https://placehold.co/600x800/1e293b/60a5fa?text=Artist'}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold mb-1">{artist.name}</h1>
          <div className="flex items-center text-sm text-gray-400">
            <Users size={14} className="mr-1" />
            {artist.memberCount} Members
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4">
        <p className="text-gray-400 text-sm">{artist.description}</p>
      </div>

      {/* Card Selection */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Select Card</h2>
        <CardGrid columns={3}>
          {artist.cards.map((card) => {
            const isSelected = selectedCard === card.id;
            const isSoldOut =
              card.totalSupply !== null &&
              card.currentSupply >= card.totalSupply;

            return (
              <div
                key={card.id}
                className={`relative ${isSoldOut ? 'opacity-50' : ''}`}
              >
                <ArtistCard
                  artistName={artist.name}
                  artistImageUrl={card.template.artistImageUrl}
                  songTitle={card.template.songTitle}
                  rarity={card.rarity}
                  className={
                    isSelected
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black'
                      : ''
                  }
                  onClick={() => !isSoldOut && setSelectedCard(card.id)}
                />
                <div className="mt-2 text-center">
                  <p className="text-lg font-bold">{formatPrice(card.price)}</p>
                  {card.totalSupply && (
                    <p className="text-xs text-gray-500">
                      {card.currentSupply} / {card.totalSupply} sold
                    </p>
                  )}
                  {isSoldOut && (
                    <p className="text-xs text-red-400 font-bold">SOLD OUT</p>
                  )}
                </div>
              </div>
            );
          })}
        </CardGrid>
      </div>

      {/* Purchase Section */}
      <div className="p-4 sticky bottom-20 bg-gradient-to-t from-black via-black to-transparent pt-8">
        {!isAuthenticated ? (
          <Link
            href={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(`/artists/${artist.id}`)}`}
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full text-center shadow-lg transition-transform hover:scale-[1.02]"
          >
            ログインして購入
          </Link>
        ) : selectedCardData ? (
          <PurchaseAgreement
            cardId={selectedCardData.id}
            price={selectedCardData.price}
            artistName={artist.name}
          />
        ) : (
          <div className="w-full bg-gray-700 text-gray-400 font-bold py-4 rounded-full text-center">
            カードを選択してください
          </div>
        )}
      </div>
    </PageContainer>
  );
}
