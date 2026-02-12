/**
 * Frame Template Configuration
 *
 * Frame templates define the visual frame/effects for cards.
 * These are hardcoded and managed by engineers (not editable in admin).
 * Admin selects a frame_template_id per card.
 *
 * 9 templates total: 3 per rarity (NORMAL, RARE, SUPER_RARE)
 */

import type { Rarity } from '@/types/card';

export type FrameTemplateId =
  | 'classic-normal'
  | 'carbon-normal'
  | 'minimal-normal'
  | 'classic-rare'
  | 'cosmic-rare'
  | 'emerald-rare'
  | 'classic-super-rare'
  | 'prismatic-super-rare'
  | 'diamond-super-rare';

export interface FrameTemplate {
  id: FrameTemplateId;
  name: string;
  nameJa: string;
  rarity: Rarity;
  cssClass: string;
  effects: string[]; // CSS class names for effects
  borderColor: string;
  glowColor?: string;
  previewGradient: string; // CSS gradient for admin preview
}

/**
 * Frame template definitions
 *
 * NORMAL (3):
 * - classic-normal: Metallic silver sheen
 * - carbon-normal: Carbon fiber texture
 * - minimal-normal: Clean thin white border
 *
 * RARE (3):
 * - classic-rare: Blue/purple energy glow
 * - cosmic-rare: Purple/pink nebula + stars
 * - emerald-rare: Green energy + nature particles
 *
 * SUPER_RARE (3):
 * - classic-super-rare: Gold rainbow hologram
 * - prismatic-super-rare: Full spectrum prismatic shift
 * - diamond-super-rare: Ice crystal + frost shimmer
 */
export const FRAME_TEMPLATES: Record<FrameTemplateId, FrameTemplate> = {
  // --- NORMAL ---
  'classic-normal': {
    id: 'classic-normal',
    name: 'Classic Silver',
    nameJa: 'クラシックシルバー',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: '#4b5563', // gray-600
    previewGradient: 'linear-gradient(135deg, #9ca3af, #6b7280, #9ca3af)',
  },
  'carbon-normal': {
    id: 'carbon-normal',
    name: 'Carbon Fiber',
    nameJa: 'カーボンファイバー',
    rarity: 'NORMAL',
    cssClass: 'card-carbon',
    effects: [],
    borderColor: '#374151', // gray-700
    previewGradient: 'linear-gradient(135deg, #1f2937, #374151, #1f2937)',
  },
  'minimal-normal': {
    id: 'minimal-normal',
    name: 'Clean Minimal',
    nameJa: 'クリーンミニマル',
    rarity: 'NORMAL',
    cssClass: 'card-minimal',
    effects: [],
    borderColor: '#e5e7eb', // gray-200
    previewGradient: 'linear-gradient(135deg, #f3f4f6, #e5e7eb, #f3f4f6)',
  },

  // --- RARE ---
  'classic-rare': {
    id: 'classic-rare',
    name: 'Electric Blue',
    nameJa: 'エレクトリックブルー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'shine'],
    borderColor: '#3b82f6', // blue-500
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #60a5fa, #3b82f6, #6366f1)',
  },
  'cosmic-rare': {
    id: 'cosmic-rare',
    name: 'Cosmic Purple',
    nameJa: 'コズミックパープル',
    rarity: 'RARE',
    cssClass: 'card-cosmic',
    effects: ['glow', 'stars'],
    borderColor: '#a855f7', // purple-500
    glowColor: 'rgba(168, 85, 247, 0.3)',
    previewGradient: 'linear-gradient(135deg, #c084fc, #a855f7, #ec4899)',
  },
  'emerald-rare': {
    id: 'emerald-rare',
    name: 'Emerald Glow',
    nameJa: 'エメラルドグロウ',
    rarity: 'RARE',
    cssClass: 'card-emerald',
    effects: ['glow', 'nature'],
    borderColor: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.3)',
    previewGradient: 'linear-gradient(135deg, #34d399, #10b981, #059669)',
  },

  // --- SUPER_RARE ---
  'classic-super-rare': {
    id: 'classic-super-rare',
    name: 'Golden Hologram',
    nameJa: 'ゴールデンホログラム',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'hologram', 'sparkle'],
    borderColor: '#fbbf24', // yellow-400
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #f472b6, #a78bfa)',
  },
  'prismatic-super-rare': {
    id: 'prismatic-super-rare',
    name: 'Rainbow Prismatic',
    nameJa: 'レインボープリズム',
    rarity: 'SUPER_RARE',
    cssClass: 'card-prismatic',
    effects: ['glow', 'prismatic', 'sparkle'],
    borderColor: '#f472b6', // pink-400
    glowColor: 'rgba(244, 114, 182, 0.5)',
    previewGradient: 'linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa, #34d399, #fbbf24)',
  },
  'diamond-super-rare': {
    id: 'diamond-super-rare',
    name: 'Diamond Frost',
    nameJa: 'ダイヤモンドフロスト',
    rarity: 'SUPER_RARE',
    cssClass: 'card-diamond',
    effects: ['glow', 'frost', 'sparkle'],
    borderColor: '#67e8f9', // cyan-300
    glowColor: 'rgba(103, 232, 249, 0.5)',
    previewGradient: 'linear-gradient(135deg, #67e8f9, #a5f3fc, #e0f2fe, #67e8f9)',
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
