'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { ArtistCard } from '@/components/cards/artist-card';
import { CardGrid } from '@/components/cards/card-grid';
import { CardDetailDialog } from '@/components/cards/card-detail-dialog';
import { useCart } from '@/contexts/cart-context';
import { ROUTES } from '@/constants/routes';
import { formatPrice } from '@/lib/utils/format';
import type { Rarity } from '@/types/card';

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

interface Props {
  artist: ArtistData;
  isAuthenticated: boolean;
}

export function ArtistDetailClient({ artist, isAuthenticated }: Props) {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addItem, removeItem, updateQuantity, isInCart, getItemQuantity } = useCart();

  const selectedCard = artist.cards.find((c) => c.id === selectedCardId);

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsDialogOpen(true);
  };

  const handleUpdateCart = async (cardId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(cardId);
    } else if (isInCart(cardId)) {
      await updateQuantity(cardId, quantity);
    } else {
      await addItem(cardId, quantity);
    }
  };

  const handlePurchase = (quantity: number) => {
    if (!isAuthenticated) {
      router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(`/artists/${artist.id}`)}`);
      return;
    }
    // Add to cart with specified quantity if not already in cart
    if (selectedCardId && !isInCart(selectedCardId)) {
      addItem(selectedCardId, quantity);
    } else if (selectedCardId) {
      updateQuantity(selectedCardId, quantity);
    }
    // Close dialog and navigate to cart for checkout
    setIsDialogOpen(false);
    router.push(ROUTES.CART);
  };

  return (
    <PageContainer>
      {/* Back Button */}
      <Link
        href={ROUTES.MARKET}
        className="fixed left-4 top-4 z-20 rounded-full bg-black/50 p-2 transition-colors hover:bg-black/70"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Artist Header */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={artist.imageUrl || 'https://placehold.co/600x800/1e293b/60a5fa?text=Artist'}
          alt={artist.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="mb-1 text-2xl font-bold">{artist.name}</h1>
          <div className="flex items-center text-sm text-gray-400">
            <Users size={14} className="mr-1" />
            {artist.memberCount} Members
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4">
        <p className="text-sm text-gray-400">{artist.description}</p>
      </div>

      {/* Card Selection */}
      <div className="px-3 py-4 pb-24 sm:px-4">
        <h2 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">Select Card</h2>
        <CardGrid columns={4}>
          {artist.cards.map((card) => {
            const isSoldOut = card.totalSupply !== null && card.currentSupply >= card.totalSupply;
            return (
              <div key={card.id} className={`relative ${isSoldOut ? 'opacity-50' : ''}`}>
                <ArtistCard
                  artistName={artist.name}
                  artistImageUrl={card.visual.artistImageUrl}
                  songTitle={card.visual.songTitle}
                  rarity={card.rarity}
                  onClick={() => !isSoldOut && handleCardClick(card.id)}
                />
                <div className="mt-1.5 text-center sm:mt-2">
                  <p className="text-sm font-bold sm:text-lg">{formatPrice(card.price)}</p>
                  {card.totalSupply && (
                    <p className="text-2xs text-gray-500 sm:text-xs">
                      {card.currentSupply} / {card.totalSupply} sold
                    </p>
                  )}
                  {isSoldOut && (
                    <p className="text-2xs font-bold text-red-400 sm:text-xs">SOLD OUT</p>
                  )}
                </div>
              </div>
            );
          })}
        </CardGrid>
      </div>

      {/* Card Detail Dialog */}
      {selectedCard && (
        <CardDetailDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          card={{
            id: selectedCard.id,
            artistName: artist.name,
            artistImageUrl: selectedCard.visual.artistImageUrl,
            songTitle: selectedCard.visual.songTitle,
            rarity: selectedCard.rarity,
            price: selectedCard.price,
            totalSupply: selectedCard.totalSupply,
            currentSupply: selectedCard.currentSupply,
          }}
          isInCart={isInCart(selectedCard.id)}
          cartQuantity={getItemQuantity(selectedCard.id)}
          onUpdateCart={(quantity) => handleUpdateCart(selectedCard.id, quantity)}
          onPurchase={handlePurchase}
          isAuthenticated={isAuthenticated}
        />
      )}
    </PageContainer>
  );
}
