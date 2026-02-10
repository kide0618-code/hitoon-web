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
  template: import('./card').CardTemplate | null;
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
