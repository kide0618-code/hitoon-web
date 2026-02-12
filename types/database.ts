/**
 * Database types for Supabase
 * Generated from schema - keep in sync with migrations
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      operators: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'super_admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
        };
      };
      artists: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          note: string | null;
          member_count: number;
          is_featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          note?: string | null;
          member_count?: number;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          note?: string | null;
          member_count?: number;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          artist_id: string;
          name: string;
          description: string | null;
          rarity: 'NORMAL' | 'RARE' | 'SUPER_RARE';
          price: number;
          total_supply: number | null;
          current_supply: number;
          max_purchase_per_user: number | null;
          card_image_url: string;
          song_title: string | null;
          subtitle: string | null;
          frame_template_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          name: string;
          description?: string | null;
          rarity?: 'NORMAL' | 'RARE' | 'SUPER_RARE';
          price: number;
          total_supply?: number | null;
          current_supply?: number;
          max_purchase_per_user?: number | null;
          card_image_url: string;
          song_title?: string | null;
          subtitle?: string | null;
          frame_template_id?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          name?: string;
          description?: string | null;
          rarity?: 'NORMAL' | 'RARE' | 'SUPER_RARE';
          price?: number;
          total_supply?: number | null;
          current_supply?: number;
          max_purchase_per_user?: number | null;
          card_image_url?: string;
          song_title?: string | null;
          subtitle?: string | null;
          frame_template_id?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      exclusive_contents: {
        Row: {
          id: string;
          card_id: string;
          type: 'video' | 'music' | 'image';
          url: string;
          title: string;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          type: 'video' | 'music' | 'image';
          url: string;
          title: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          type?: 'video' | 'music' | 'image';
          url?: string;
          title?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string | null;
          card_id: string | null;
          serial_number: number;
          price_paid: number;
          quantity_in_order: number;
          stripe_checkout_session_id: string;
          stripe_payment_intent_id: string | null;
          status: 'pending' | 'completed' | 'refunded';
          purchased_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          card_id?: string | null;
          serial_number: number;
          price_paid: number;
          quantity_in_order?: number;
          stripe_checkout_session_id: string;
          stripe_payment_intent_id?: string | null;
          status?: 'pending' | 'completed' | 'refunded';
          purchased_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          card_id?: string | null;
          serial_number?: number;
          price_paid?: number;
          quantity_in_order?: number;
          stripe_checkout_session_id?: string;
          stripe_payment_intent_id?: string | null;
          status?: 'pending' | 'completed' | 'refunded';
          purchased_at?: string;
        };
      };
      artist_social_links: {
        Row: {
          id: string;
          artist_id: string;
          platform:
            | 'spotify'
            | 'youtube'
            | 'twitter'
            | 'instagram'
            | 'tiktok'
            | 'website'
            | 'apple_music'
            | 'line';
          url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          platform:
            | 'spotify'
            | 'youtube'
            | 'twitter'
            | 'instagram'
            | 'tiktok'
            | 'website'
            | 'apple_music'
            | 'line';
          url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          platform?:
            | 'spotify'
            | 'youtube'
            | 'twitter'
            | 'instagram'
            | 'tiktok'
            | 'website'
            | 'apple_music'
            | 'line';
          url?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          quantity: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          quantity?: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_id?: string;
          quantity?: number;
          added_at?: string;
        };
      };
      artist_payouts: {
        Row: {
          id: string;
          artist_id: string;
          year: number;
          month: number;
          payout_status: 'pending' | 'transferred' | 'confirmed';
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          year: number;
          month: number;
          payout_status?: 'pending' | 'transferred' | 'confirmed';
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          year?: number;
          month?: number;
          payout_status?: 'pending' | 'transferred' | 'confirmed';
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      is_operator: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      increment_card_supply: {
        Args: {
          p_card_id: string;
          p_quantity: number;
        };
        Returns: {
          new_supply: number;
          old_supply: number;
          card_price: number;
        }[];
      };
      clear_user_cart: {
        Args: {
          p_user_id: string;
        };
        Returns: void;
      };
      merge_cart: {
        Args: {
          p_user_id: string;
          p_items: Json;
        };
        Returns: void;
      };
    };
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Operator = Database['public']['Tables']['operators']['Row'];
export type Artist = Database['public']['Tables']['artists']['Row'];
export type Card = Database['public']['Tables']['cards']['Row'];
export type ExclusiveContent = Database['public']['Tables']['exclusive_contents']['Row'];
export type Purchase = Database['public']['Tables']['purchases']['Row'];
export type ArtistSocialLink = Database['public']['Tables']['artist_social_links']['Row'];
export type Cart = Database['public']['Tables']['carts']['Row'];
export type ArtistPayout = Database['public']['Tables']['artist_payouts']['Row'];

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type OperatorInsert = Database['public']['Tables']['operators']['Insert'];
export type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
export type CardInsert = Database['public']['Tables']['cards']['Insert'];
export type ExclusiveContentInsert = Database['public']['Tables']['exclusive_contents']['Insert'];
export type PurchaseInsert = Database['public']['Tables']['purchases']['Insert'];
export type ArtistSocialLinkInsert = Database['public']['Tables']['artist_social_links']['Insert'];
export type CartInsert = Database['public']['Tables']['carts']['Insert'];
export type ArtistPayoutInsert = Database['public']['Tables']['artist_payouts']['Insert'];

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ArtistUpdate = Database['public']['Tables']['artists']['Update'];
export type CardUpdate = Database['public']['Tables']['cards']['Update'];
export type ArtistSocialLinkUpdate = Database['public']['Tables']['artist_social_links']['Update'];
export type CartUpdate = Database['public']['Tables']['carts']['Update'];
export type ArtistPayoutUpdate = Database['public']['Tables']['artist_payouts']['Update'];
