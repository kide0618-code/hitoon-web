/**
 * Card rarity levels
 */
export type Rarity = 'NORMAL' | 'RARE' | 'SUPER_RARE';

/**
 * Rarity display configuration
 */
export const RARITY_CONFIG = {
  NORMAL: {
    code: 'N',
    label: 'Normal',
    color: 'gray',
    frameClass: 'border-gray-600',
    badgeClass: 'bg-gray-600 text-white',
  },
  RARE: {
    code: 'R',
    label: 'Rare',
    color: 'blue',
    frameClass: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    badgeClass: 'bg-blue-500 text-white',
  },
  SUPER_RARE: {
    code: 'SR',
    label: 'Super Rare',
    color: 'gold',
    frameClass: 'border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.5)]',
    badgeClass: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black',
  },
} as const;

/**
 * Card visual content (multiple per artist possible - album, single, etc.)
 * Contains the visual content (image, song title) that is combined with a FrameTemplate.
 *
 * Note: FrameTemplate (frame/effects) is defined in config/frame-templates.ts
 */
export interface CardVisual {
  id: string;
  artistId: string;
  name: string; // Visual identifier for admin (e.g., "1st Album", "Summer Single")
  artistImageUrl: string;
  songTitle: string | null;
  subtitle: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** @deprecated Use CardVisual instead */
export type CardTemplate = CardVisual;

/**
 * Card entity (3 per visual: NORMAL, RARE, SUPER_RARE)
 */
export interface Card {
  id: string;
  visualId: string;
  artistId: string;
  name: string;
  description: string | null;
  rarity: Rarity;
  price: number;
  totalSupply: number | null;
  currentSupply: number;
  maxPurchasePerUser: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Card with visual content for display
 */
export interface CardWithVisual extends Card {
  visual: CardVisual;
}

/** @deprecated Use CardWithVisual instead */
export type CardWithTemplate = CardWithVisual;

/**
 * Exclusive content for card owners (per rarity)
 * Linked to card_id for rarity-specific content (e.g., SR-only bonus)
 */
export interface ExclusiveContent {
  id: string;
  cardId: string;
  type: 'video' | 'music' | 'image';
  url: string; // External URL (YouTube, Vimeo, etc.)
  title: string;
  description: string | null;
  displayOrder: number;
  createdAt: string;
}
