import type { Rarity } from './card';

/**
 * Cart item stored in database
 */
export interface CartItem {
  id: string;
  userId: string;
  cardId: string;
  quantity: number;
  addedAt: string;
}

/**
 * Cart item with card details for display
 */
export interface CartItemWithCard extends CartItem {
  card: {
    id: string;
    name: string;
    price: number;
    rarity: Rarity;
    totalSupply: number | null;
    currentSupply: number;
    visual: {
      artistImageUrl: string;
      songTitle: string | null;
    };
    artist: {
      id: string;
      name: string;
    };
  };
}

/**
 * Local storage cart item (for guests)
 */
export interface LocalCartItem {
  cardId: string;
  quantity: number;
  addedAt: string;
}

/**
 * Cart context state
 */
export interface CartState {
  items: CartItemWithCard[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
}

/**
 * Cart context actions
 */
export interface CartActions {
  addItem: (cardId: string, quantity?: number) => Promise<void>;
  removeItem: (cardId: string) => Promise<void>;
  updateQuantity: (cardId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (cardId: string) => boolean;
  getItemQuantity: (cardId: string) => number;
  refreshCart: () => Promise<void>;
}

/**
 * Full cart context type
 */
export type CartContextType = CartState & CartActions;

/**
 * API request types
 */
export interface AddToCartRequest {
  cardId: string;
  quantity?: number;
}

export interface UpdateCartRequest {
  cardId: string;
  quantity: number;
}

export interface CartCheckoutRequest {
  items: Array<{
    cardId: string;
    quantity: number;
  }>;
}
