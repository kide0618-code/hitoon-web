import type { Card } from './card';
import type { Artist } from './artist';

/**
 * Purchase status
 */
export type PurchaseStatus = 'pending' | 'completed' | 'refunded';

/**
 * Purchase entity
 */
export interface Purchase {
  id: string;
  userId: string;
  cardId: string;
  serialNumber: number;
  pricePaid: number;
  quantityInOrder: number; // How many cards in the original order
  stripeCheckoutSessionId: string; // Required for idempotency
  stripePaymentIntentId: string | null;
  status: PurchaseStatus;
  purchasedAt: string;
}

/**
 * Purchase with card and artist for collection display
 */
export interface PurchaseWithDetails extends Purchase {
  card: Card & {
    artist: Artist;
  };
}

/**
 * Collection item for display (grouped by card)
 */
export interface CollectionItem {
  cardId: string;
  artistId: string;
  artistName: string;
  artistImageUrl: string;
  songTitle: string | null;
  rarity: import('./card').Rarity;
  totalSupply: number | null;
  ownedCount: number; // How many of this card the user owns
  serialNumbers: number[]; // All serial numbers owned
  latestPurchaseAt: string;
  hasExclusiveContent: boolean;
}

/**
 * Grouped collection for efficient display
 */
export interface GroupedCollection {
  items: CollectionItem[];
  totalCards: number; // Sum of all ownedCount
  uniqueCards: number; // Number of unique card types
}
