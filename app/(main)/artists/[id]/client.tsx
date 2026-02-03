'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Check, ShoppingCart } from 'lucide-react';
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
  const { addItem, removeItem, updateQuantity, isInCart, getItemQuantity, totalItems } = useCart();

  const selectedCard = artist.cards.find((c) => c.id === selectedCardId);

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsDialogOpen(true);
  };

  const handleToggleCart = async (cardId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isInCart(cardId)) {
      await removeItem(cardId);
    } else {
      await addItem(cardId, 1);
    }
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
        className="fixed top-4 left-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Cart Button */}
      {totalItems > 0 && (
        <Link
          href={ROUTES.CART}
          className="fixed top-4 right-4 z-20 bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors flex items-center gap-1"
        >
          <ShoppingCart size={20} />
          <span className="text-sm font-bold pr-1">{totalItems}</span>
        </Link>
      )}

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
      <div className="px-3 sm:px-4 py-4 pb-24">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Select Card</h2>
        <CardGrid columns={2}>
          {artist.cards.map((card) => {
            const isSoldOut =
              card.totalSupply !== null &&
              card.currentSupply >= card.totalSupply;
            const cardInCart = isInCart(card.id);

            return (
              <div
                key={card.id}
                className={`relative ${isSoldOut ? 'opacity-50' : ''}`}
              >
                {/* Cart Toggle Checkbox - Top Right */}
                <button
                  onClick={(e) => !isSoldOut && handleToggleCart(card.id, e)}
                  disabled={isSoldOut}
                  className={`absolute -top-1 -right-1 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    cardInCart
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 border-2 border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500'
                  } ${isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={cardInCart ? 'カートから削除' : 'カートに追加'}
                >
                  {cardInCart && <Check size={16} strokeWidth={3} />}
                </button>

                <ArtistCard
                  artistName={artist.name}
                  artistImageUrl={card.visual.artistImageUrl}
                  songTitle={card.visual.songTitle}
                  rarity={card.rarity}
                  onClick={() => !isSoldOut && handleCardClick(card.id)}
                />
                <div className="mt-1.5 sm:mt-2 text-center">
                  <p className="text-sm sm:text-lg font-bold">{formatPrice(card.price)}</p>
                  {card.totalSupply && (
                    <p className="text-2xs sm:text-xs text-gray-500">
                      {card.currentSupply} / {card.totalSupply} sold
                    </p>
                  )}
                  {isSoldOut && (
                    <p className="text-2xs sm:text-xs text-red-400 font-bold">SOLD OUT</p>
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
