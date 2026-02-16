/**
 * Frame Template Configuration
 *
 * All combinations of frame style × holo effect per rarity.
 * 4 effects × 2 frame options × 3 rarities = 24 templates.
 *
 * Frame options:
 * - frame (machined): 3D metallic channel frame
 * - frameless (none): No frame, image fills entire card
 *
 * Holo effects:
 * - none: No holographic shine
 * - radiant: Crosshatch metallic sheen with sparkle
 * - sunpillar: Rainbow beams with stripe overlays
 * - secret-gold: Gold conic gradient + double glitter
 */

import type { Rarity } from '@/types/card';

export type FrameStyle = 'none' | 'flat' | 'machined';
export type HoloEffect = 'none' | 'radiant' | 'sunpillar' | 'secret-gold';

export type FrameTemplateId =
  // NORMAL (8): frame × 4 effects + frameless × 4 effects
  | 'normal-frame-none'
  | 'normal-frame-radiant'
  | 'normal-frame-sunpillar'
  | 'normal-frame-secret-gold'
  | 'normal-frameless-none'
  | 'normal-frameless-radiant'
  | 'normal-frameless-sunpillar'
  | 'normal-frameless-secret-gold'
  // RARE (8)
  | 'rare-frame-none'
  | 'rare-frame-radiant'
  | 'rare-frame-sunpillar'
  | 'rare-frame-secret-gold'
  | 'rare-frameless-none'
  | 'rare-frameless-radiant'
  | 'rare-frameless-sunpillar'
  | 'rare-frameless-secret-gold'
  // SUPER_RARE (8)
  | 'sr-frame-none'
  | 'sr-frame-radiant'
  | 'sr-frame-sunpillar'
  | 'sr-frame-secret-gold'
  | 'sr-frameless-none'
  | 'sr-frameless-radiant'
  | 'sr-frameless-sunpillar'
  | 'sr-frameless-secret-gold';

export interface FrameTemplate {
  id: FrameTemplateId;
  name: string;
  nameJa: string;
  rarity: Rarity;
  cssClass: string;
  effects: string[];
  borderColor: string;
  glowColor?: string;
  previewGradient: string;
  frameStyle: FrameStyle;
  holoEffect: HoloEffect;
}

export const FRAME_TEMPLATES: Record<FrameTemplateId, FrameTemplate> = {
  // =====================================================
  // NORMAL — Frame (machined) × 4 effects
  // =====================================================
  'normal-frame-none': {
    id: 'normal-frame-none',
    name: 'Silver Frame',
    nameJa: 'シルバーフレーム',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(135deg, #9ca3af, #6b7280, #9ca3af)',
    frameStyle: 'machined',
    holoEffect: 'none',
  },
  'normal-frame-radiant': {
    id: 'normal-frame-radiant',
    name: 'Silver Radiant',
    nameJa: 'シルバーラディアント',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: ['radiant'],
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(135deg, #9ca3af, #d1d5db, #9ca3af)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'normal-frame-sunpillar': {
    id: 'normal-frame-sunpillar',
    name: 'Silver Sunpillar',
    nameJa: 'シルバーサンピラー',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: ['sunpillar'],
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(135deg, #9ca3af, #93c5fd, #c084fc, #9ca3af)',
    frameStyle: 'machined',
    holoEffect: 'sunpillar',
  },
  'normal-frame-secret-gold': {
    id: 'normal-frame-secret-gold',
    name: 'Silver Secret',
    nameJa: 'シルバーシークレット',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: ['secret-gold'],
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(135deg, #9ca3af, #fbbf24, #9ca3af)',
    frameStyle: 'machined',
    holoEffect: 'secret-gold',
  },

  // =====================================================
  // NORMAL — Frameless (none) × 4 effects
  // =====================================================
  'normal-frameless-none': {
    id: 'normal-frameless-none',
    name: 'Frameless Plain',
    nameJa: 'フレームレス',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: 'transparent',
    previewGradient: 'linear-gradient(180deg, #111827, #0a0a0f)',
    frameStyle: 'none',
    holoEffect: 'none',
  },
  'normal-frameless-radiant': {
    id: 'normal-frameless-radiant',
    name: 'Frameless Radiant',
    nameJa: 'フレームレスラディアント',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: ['radiant'],
    borderColor: 'transparent',
    previewGradient: 'linear-gradient(135deg, #1f2937, #374151, #1f2937)',
    frameStyle: 'none',
    holoEffect: 'radiant',
  },
  'normal-frameless-sunpillar': {
    id: 'normal-frameless-sunpillar',
    name: 'Frameless Sunpillar',
    nameJa: 'フレームレスサンピラー',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: ['sunpillar'],
    borderColor: 'transparent',
    previewGradient: 'linear-gradient(135deg, #1f2937, #60a5fa, #c084fc, #1f2937)',
    frameStyle: 'none',
    holoEffect: 'sunpillar',
  },
  'normal-frameless-secret-gold': {
    id: 'normal-frameless-secret-gold',
    name: 'Frameless Secret',
    nameJa: 'フレームレスシークレット',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: ['secret-gold'],
    borderColor: 'transparent',
    previewGradient: 'linear-gradient(135deg, #1f2937, #fbbf24, #1f2937)',
    frameStyle: 'none',
    holoEffect: 'secret-gold',
  },

  // =====================================================
  // RARE — Frame (machined) × 4 effects
  // =====================================================
  'rare-frame-none': {
    id: 'rare-frame-none',
    name: 'Blue Chrome',
    nameJa: 'ブルークローム',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #60a5fa, #3b82f6, #60a5fa)',
    frameStyle: 'machined',
    holoEffect: 'none',
  },
  'rare-frame-radiant': {
    id: 'rare-frame-radiant',
    name: 'Blue Radiant',
    nameJa: 'ブルーラディアント',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'radiant'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #60a5fa, #9ca3af, #6366f1)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'rare-frame-sunpillar': {
    id: 'rare-frame-sunpillar',
    name: 'Blue Sunpillar',
    nameJa: 'ブルーサンピラー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'sunpillar'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #60a5fa, #3b82f6, #c084fc, #6366f1)',
    frameStyle: 'machined',
    holoEffect: 'sunpillar',
  },
  'rare-frame-secret-gold': {
    id: 'rare-frame-secret-gold',
    name: 'Blue Secret',
    nameJa: 'ブルーシークレット',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'secret-gold'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #3b82f6, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'secret-gold',
  },

  // =====================================================
  // RARE — Frameless (none) × 4 effects
  // =====================================================
  'rare-frameless-none': {
    id: 'rare-frameless-none',
    name: 'Frameless Blue',
    nameJa: 'フレームレスブルー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow'],
    borderColor: 'transparent',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(180deg, #1e3a5f, #1e1b4b)',
    frameStyle: 'none',
    holoEffect: 'none',
  },
  'rare-frameless-radiant': {
    id: 'rare-frameless-radiant',
    name: 'Frameless Blue Radiant',
    nameJa: 'フレームレスブルーラディアント',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'radiant'],
    borderColor: 'transparent',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #1e3a5f, #374151, #1e1b4b)',
    frameStyle: 'none',
    holoEffect: 'radiant',
  },
  'rare-frameless-sunpillar': {
    id: 'rare-frameless-sunpillar',
    name: 'Frameless Blue Sunpillar',
    nameJa: 'フレームレスブルーサンピラー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'sunpillar'],
    borderColor: 'transparent',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #1e3a5f, #c084fc, #1e1b4b)',
    frameStyle: 'none',
    holoEffect: 'sunpillar',
  },
  'rare-frameless-secret-gold': {
    id: 'rare-frameless-secret-gold',
    name: 'Frameless Blue Secret',
    nameJa: 'フレームレスブルーシークレット',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'secret-gold'],
    borderColor: 'transparent',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #1e3a5f, #fbbf24, #1e1b4b)',
    frameStyle: 'none',
    holoEffect: 'secret-gold',
  },

  // =====================================================
  // SUPER_RARE — Frame (machined) × 4 effects
  // =====================================================
  'sr-frame-none': {
    id: 'sr-frame-none',
    name: 'Gold Frame',
    nameJa: 'ゴールドフレーム',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'none',
  },
  'sr-frame-radiant': {
    id: 'sr-frame-radiant',
    name: 'Gold Radiant',
    nameJa: 'ゴールドラディアント',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'radiant'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #9ca3af, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'sr-frame-sunpillar': {
    id: 'sr-frame-sunpillar',
    name: 'Gold Sunpillar',
    nameJa: 'ゴールドサンピラー',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'sunpillar'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #60a5fa, #f472b6, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'sunpillar',
  },
  'sr-frame-secret-gold': {
    id: 'sr-frame-secret-gold',
    name: 'Gold Secret',
    nameJa: 'ゴールドシークレット',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'secret-gold', 'sparkle'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #f472b6, #a78bfa)',
    frameStyle: 'machined',
    holoEffect: 'secret-gold',
  },

  // =====================================================
  // SUPER_RARE — Frameless (none) × 4 effects
  // =====================================================
  'sr-frameless-none': {
    id: 'sr-frameless-none',
    name: 'Frameless Gold',
    nameJa: 'フレームレスゴールド',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow'],
    borderColor: 'transparent',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(180deg, #44337a, #831843)',
    frameStyle: 'none',
    holoEffect: 'none',
  },
  'sr-frameless-radiant': {
    id: 'sr-frameless-radiant',
    name: 'Frameless Gold Radiant',
    nameJa: 'フレームレスゴールドラディアント',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'radiant'],
    borderColor: 'transparent',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #44337a, #9ca3af, #831843)',
    frameStyle: 'none',
    holoEffect: 'radiant',
  },
  'sr-frameless-sunpillar': {
    id: 'sr-frameless-sunpillar',
    name: 'Frameless Gold Sunpillar',
    nameJa: 'フレームレスゴールドサンピラー',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'sunpillar'],
    borderColor: 'transparent',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #44337a, #60a5fa, #f472b6, #831843)',
    frameStyle: 'none',
    holoEffect: 'sunpillar',
  },
  'sr-frameless-secret-gold': {
    id: 'sr-frameless-secret-gold',
    name: 'Frameless Gold Secret',
    nameJa: 'フレームレスゴールドシークレット',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'secret-gold', 'sparkle'],
    borderColor: 'transparent',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #44337a, #fbbf24, #831843)',
    frameStyle: 'none',
    holoEffect: 'secret-gold',
  },
} as const;

/**
 * Default frame template per rarity
 */
const RARITY_TO_FRAME: Record<Rarity, FrameTemplateId> = {
  NORMAL: 'normal-frame-radiant',
  RARE: 'rare-frame-sunpillar',
  SUPER_RARE: 'sr-frame-secret-gold',
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
export function getFrameTemplate(id: string): FrameTemplate | undefined {
  return FRAME_TEMPLATES[id as FrameTemplateId];
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
