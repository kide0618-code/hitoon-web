"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  CartContextType,
  CartItemWithCard,
  LocalCartItem,
} from "@/types/cart";

const CART_STORAGE_KEY = "hitoon_cart";

const CartContext = createContext<CartContextType | null>(null);

/**
 * Get cart items from localStorage (for guests)
 */
function getLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart items to localStorage (for guests)
 */
function saveLocalCart(items: LocalCartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or disabled
  }
}

/**
 * Clear localStorage cart
 */
function clearLocalCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

interface CartProviderProps {
  children: ReactNode;
}

// Type for card query result
interface CardQueryResult {
  id: string;
  name: string;
  price: number;
  rarity: string;
  total_supply: number | null;
  current_supply: number;
  visual:
    | { artist_image_url: string; song_title: string | null }
    | { artist_image_url: string; song_title: string | null }[]
    | null;
  artist: { id: string; name: string } | { id: string; name: string }[] | null;
}

// Type for cart DB item
interface CartDbItem {
  card_id: string;
  quantity: number;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItemWithCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch cart items with card details
  const fetchCartWithDetails = useCallback(
    async (
      cartItems: { cardId: string; quantity: number }[],
    ): Promise<CartItemWithCard[]> => {
      if (cartItems.length === 0) return [];

      const cardIds = cartItems.map((item) => item.cardId);
      const { data: cards, error } = await supabase
        .from("cards")
        .select(
          `
          id,
          name,
          price,
          rarity,
          total_supply,
          current_supply,
          visual:card_visuals (
            artist_image_url,
            song_title
          ),
          artist:artists (
            id,
            name
          )
        `,
        )
        .in("id", cardIds)
        .eq("is_active", true);

      if (error || !cards) return [];

      // Cast to expected type
      const typedCards = cards as unknown as CardQueryResult[];

      return cartItems
        .map((item) => {
          const card = typedCards.find((c) => c.id === item.cardId);
          if (!card) return null;

          // Handle Supabase's nested types
          const visual = Array.isArray(card.visual)
            ? card.visual[0]
            : card.visual;
          const artist = Array.isArray(card.artist)
            ? card.artist[0]
            : card.artist;

          return {
            id: `${userId || "guest"}-${item.cardId}`,
            userId: userId || "guest",
            cardId: item.cardId,
            quantity: item.quantity,
            addedAt: new Date().toISOString(),
            card: {
              id: card.id,
              name: card.name,
              price: card.price,
              rarity: card.rarity as CartItemWithCard["card"]["rarity"],
              totalSupply: card.total_supply,
              currentSupply: card.current_supply,
              visual: {
                artistImageUrl: visual?.artist_image_url || "",
                songTitle: visual?.song_title || null,
              },
              artist: {
                id: artist?.id || "",
                name: artist?.name || "Unknown Artist",
              },
            },
          } as CartItemWithCard;
        })
        .filter((item): item is CartItemWithCard => item !== null);
    },
    [supabase, userId],
  );

  // Load cart from DB (authenticated) or localStorage (guest)
  // If authenticated and localStorage has items, merge them first
  const loadCart = useCallback(async () => {
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id || null);

    if (user) {
      // Merge localStorage cart into DB if present
      const localCart = getLocalCart();
      if (localCart.length > 0) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.rpc as any)("merge_cart", {
            p_user_id: user.id,
            p_items: localCart.map((item) => ({
              card_id: item.cardId,
              quantity: item.quantity,
            })),
          });
          clearLocalCart();
        } catch (err) {
          console.error("Failed to merge cart:", err);
        }
      }

      // Authenticated: Load from DB
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dbCart } = (await (supabase.from("carts") as any)
        .select("card_id, quantity")
        .eq("user_id", user.id)) as { data: CartDbItem[] | null };

      if (dbCart && dbCart.length > 0) {
        const cartItems = dbCart.map((item) => ({
          cardId: item.card_id,
          quantity: item.quantity,
        }));
        const itemsWithCards = await fetchCartWithDetails(cartItems);
        setItems(itemsWithCards);
      } else {
        setItems([]);
      }
    } else {
      // Guest: Load from localStorage
      const localCart = getLocalCart();
      if (localCart.length > 0) {
        const cartItems = localCart.map((item) => ({
          cardId: item.cardId,
          quantity: item.quantity,
        }));
        const itemsWithCards = await fetchCartWithDetails(cartItems);
        setItems(itemsWithCards);
      } else {
        setItems([]);
      }
    }

    setIsLoading(false);
  }, [supabase, fetchCartWithDetails]);

  // Initial load and auth state changes
  useEffect(() => {
    loadCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Merge is handled inside loadCart() so it works for both
        // email/password (SIGNED_IN) and OAuth redirect (INITIAL_SESSION)
        setUserId(session.user.id);
        loadCart();
      } else if (event === "INITIAL_SESSION" && session?.user) {
        // OAuth redirect login fires INITIAL_SESSION instead of SIGNED_IN
        setUserId(session.user.id);
        loadCart();
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setItems([]);
        loadCart();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, loadCart]);

  // Add item to cart
  const addItem = useCallback(
    async (cardId: string, quantity: number = 1) => {
      const clampedQty = Math.max(1, Math.min(10, quantity));

      // Check if item already exists
      const existingItem = items.find((i) => i.cardId === cardId);

      if (existingItem) {
        // Item exists, update quantity optimistically
        const newQty = Math.min(10, existingItem.quantity + clampedQty);
        setItems((prev) =>
          prev.map((item) =>
            item.cardId === cardId ? { ...item, quantity: newQty } : item,
          ),
        );

        // Sync with backend
        if (userId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from("carts") as any)
            .update({ quantity: newQty })
            .eq("user_id", userId)
            .eq("card_id", cardId);
        } else {
          const localCart = getLocalCart();
          const item = localCart.find((i) => i.cardId === cardId);
          if (item) {
            item.quantity = newQty;
            saveLocalCart(localCart);
          }
        }
      } else {
        // New item - need to fetch card details first, then add
        if (userId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await (supabase.from("carts") as any).upsert(
            {
              user_id: userId,
              card_id: cardId,
              quantity: clampedQty,
            },
            {
              onConflict: "user_id,card_id",
            },
          );
          if (error) {
            console.error("Failed to add to cart:", error);
            return;
          }
        } else {
          const localCart = getLocalCart();
          localCart.push({
            cardId,
            quantity: clampedQty,
            addedAt: new Date().toISOString(),
          });
          saveLocalCart(localCart);
        }
        // For new items, we need to load to get card details
        await loadCart();
      }
    },
    [userId, supabase, loadCart, items],
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (cardId: string) => {
      // Optimistic update
      setItems((prev) => prev.filter((item) => item.cardId !== cardId));

      // Sync with backend
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("carts") as any)
          .delete()
          .eq("user_id", userId)
          .eq("card_id", cardId);
      } else {
        const localCart = getLocalCart().filter(
          (item) => item.cardId !== cardId,
        );
        saveLocalCart(localCart);
      }
    },
    [userId, supabase],
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (cardId: string, quantity: number) => {
      const clampedQty = Math.max(1, Math.min(10, quantity));

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.cardId === cardId ? { ...item, quantity: clampedQty } : item,
        ),
      );

      // Sync with backend
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("carts") as any)
          .update({ quantity: clampedQty })
          .eq("user_id", userId)
          .eq("card_id", cardId);
      } else {
        const localCart = getLocalCart();
        const item = localCart.find((i) => i.cardId === cardId);
        if (item) {
          item.quantity = clampedQty;
          saveLocalCart(localCart);
        }
      }
    },
    [userId, supabase],
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("carts") as any).delete().eq("user_id", userId);
    } else {
      clearLocalCart();
    }
    setItems([]);
  }, [userId, supabase]);

  // Check if card is in cart
  const isInCart = useCallback(
    (cardId: string): boolean => {
      return items.some((item) => item.cardId === cardId);
    },
    [items],
  );

  // Get quantity of specific card in cart
  const getItemQuantity = useCallback(
    (cardId: string): number => {
      const item = items.find((i) => i.cardId === cardId);
      return item?.quantity || 0;
    },
    [items],
  );

  // Refresh cart (re-fetch)
  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  // Calculate totals
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.card.price * item.quantity, 0),
    [items],
  );

  const value: CartContextType = {
    items,
    isLoading,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
