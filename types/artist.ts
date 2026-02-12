/**
 * Social media platforms supported for artist links
 */
export type SocialPlatform =
  | 'spotify'
  | 'youtube'
  | 'twitter'
  | 'instagram'
  | 'tiktok'
  | 'website'
  | 'apple_music'
  | 'line';

/**
 * Social link for an artist
 */
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

/**
 * Artist entity
 */
export interface Artist {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  memberCount: number;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Artist with cards for detail page
 */
export interface ArtistWithCards extends Artist {
  cards: import('./card').Card[];
}

/**
 * Artist list item for marketplace
 */
export interface ArtistListItem {
  id: string;
  name: string;
  imageUrl: string | null;
  memberCount: number;
  lowestPrice: number;
}
