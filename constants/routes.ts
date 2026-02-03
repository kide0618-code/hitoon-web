/**
 * Application routes
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  MARKET: '/market',
  ARTIST: (id: string) => `/artists/${id}` as const,
  CART: '/cart',

  // Protected routes
  COLLECTION: '/collection',
  COLLECTION_DETAIL: (id: string) => `/collection/${id}` as const,
  ACTIVITY: '/activity',
  SETTINGS: '/settings',

  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Legal routes
  TERMS: '/terms',
  PRIVACY: '/privacy',
  TOKUSHOHO: '/tokushoho',

  // API routes
  API: {
    ARTISTS: '/api/artists',
    ARTIST: (id: string) => `/api/artists/${id}` as const,
    CARDS: '/api/cards',
    CART: '/api/cart',
    CHECKOUT: '/api/checkout',
    PURCHASES: '/api/purchases',
    WEBHOOKS: {
      STRIPE: '/api/webhooks/stripe',
    },
  },
} as const;

/**
 * External URLs
 */
export const EXTERNAL_URLS = {
  STRIPE_DASHBOARD: 'https://dashboard.stripe.com',
  SUPABASE_DASHBOARD: 'https://supabase.com/dashboard',
} as const;
