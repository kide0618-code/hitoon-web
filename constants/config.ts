/**
 * Application configuration
 */
export const APP_CONFIG = {
  name: 'HITOON',
  tagline: '音楽を、一生モノにする。',
  description: 'Music Asset Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://hitoonstore.com',
} as const;

/**
 * Card configuration
 */
export const CARD_CONFIG = {
  aspectRatio: '3/4',
  maxQuantityPerPurchase: 10,
  imageSize: {
    width: 600,
    height: 800,
  },
} as const;

/**
 * Rarity pricing guidelines
 */
export const RARITY_PRICING = {
  NORMAL: {
    min: 800,
    max: 1500,
    defaultSupply: null, // unlimited
  },
  RARE: {
    min: 1500,
    max: 3000,
    defaultSupply: 100,
  },
  SUPER_RARE: {
    min: 3000,
    max: 10000,
    defaultSupply: 30,
  },
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;
