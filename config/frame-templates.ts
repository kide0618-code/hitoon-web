/**
 * Frame Template Configuration
 *
 * Frame templates define the visual frame/effects for cards.
 * These are hardcoded and managed by engineers (not editable in admin).
 *
 * Key distinction:
 * - FrameTemplate: The decorative frame/effects (this file)
 * - CardVisual: The content (artist image, song title) stored in DB
 */

import type { Rarity } from '@/types/card';

export type FrameTemplateId =
  | 'classic-normal'
  | 'classic-rare'
  | 'classic-super-rare';

export interface FrameTemplate {
  id: FrameTemplateId;
  name: string;
  rarity: Rarity;
  cssClass: string;
  effects: string[]; // CSS class names for effects
  borderColor: string;
  glowColor?: string;
}

/**
 * Frame template definitions
 * - classic-normal: Simple dark frame, no effects
 * - classic-rare: Blue/purple glow effect
 * - classic-super-rare: Gold frame with hologram and sparkle effects
 */
export const FRAME_TEMPLATES: Record<FrameTemplateId, FrameTemplate> = {
  'classic-normal': {
    id: 'classic-normal',
    name: 'クラシック Normal',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: '#4b5563', // gray-600
  },
  'classic-rare': {
    id: 'classic-rare',
    name: 'クラシック Rare',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'shine'],
    borderColor: '#3b82f6', // blue-500
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  'classic-super-rare': {
    id: 'classic-super-rare',
    name: 'クラシック Super Rare',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'hologram', 'sparkle'],
    borderColor: '#fbbf24', // yellow-400
    glowColor: 'rgba(251, 191, 36, 0.5)',
  },
} as const;

/**
 * Mapping from rarity to default frame template
 */
const RARITY_TO_FRAME: Record<Rarity, FrameTemplateId> = {
  NORMAL: 'classic-normal',
  RARE: 'classic-rare',
  SUPER_RARE: 'classic-super-rare',
} as const;

/**
 * Get the default frame template for a given rarity
 */
export function getDefaultFrameForRarity(rarity: Rarity): FrameTemplate {
  return FRAME_TEMPLATES[RARITY_TO_FRAME[rarity]];
}

/**
 * Get a frame template by its ID
 */
export function getFrameTemplate(id: FrameTemplateId): FrameTemplate {
  return FRAME_TEMPLATES[id];
}

/**
 * Get all frame templates as an array
 */
export function getAllFrameTemplates(): FrameTemplate[] {
  return Object.values(FRAME_TEMPLATES);
}

/**
 * Get frame templates filtered by rarity
 */
export function getFrameTemplatesByRarity(rarity: Rarity): FrameTemplate[] {
  return Object.values(FRAME_TEMPLATES).filter((t) => t.rarity === rarity);
}
