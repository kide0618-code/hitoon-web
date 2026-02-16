/**
 * Frame Template Configuration
 *
 * Frame templates define the visual frame/effects for cards.
 * These are hardcoded and managed by engineers (not editable in admin).
 * Admin selects a frame_template_id per card.
 *
 * Each template specifies:
 * - frameStyle: none (no frame) | flat (simple border) | machined (3D metallic channel)
 * - holoEffect: none | radiant (crosshatch) | sunpillar (rainbow) | secret-gold (gold hologram)
 */

import type { Rarity } from '@/types/card';

export type FrameStyle = 'none' | 'flat' | 'machined';
export type HoloEffect = 'none' | 'radiant' | 'sunpillar' | 'secret-gold';

export type FrameTemplateId =
  // NORMAL (8)
  | 'classic-normal'
  | 'carbon-normal'
  | 'minimal-normal'
  | 'flat-normal'
  | 'frameless-normal'
  | 'plain-normal'
  | 'flat-plain-normal'
  | 'frameless-plain-normal'
  // RARE (8)
  | 'classic-rare'
  | 'cosmic-rare'
  | 'emerald-rare'
  | 'flat-rare'
  | 'frameless-rare'
  | 'plain-rare'
  | 'radiant-rare'
  | 'gold-rare'
  // SUPER_RARE (8)
  | 'classic-super-rare'
  | 'prismatic-super-rare'
  | 'diamond-super-rare'
  | 'flat-super-rare'
  | 'frameless-super-rare'
  | 'plain-super-rare'
  | 'radiant-super-rare'
  | 'sunpillar-super-rare';

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
  frameStyle: FrameStyle;
  holoEffect: HoloEffect;
}

/**
 * Frame template definitions
 *
 * NORMAL (8):
 * - classic-normal: Machined silver + radiant holo
 * - carbon-normal: Machined carbon + radiant holo
 * - minimal-normal: Machined minimal + radiant holo
 * - flat-normal: Flat border + radiant holo
 * - frameless-normal: No frame + radiant holo
 * - plain-normal: Machined silver + no holo
 * - flat-plain-normal: Flat border + no holo
 * - frameless-plain-normal: No frame + no holo
 *
 * RARE (8):
 * - classic-rare: Machined blue-chrome + sunpillar holo
 * - cosmic-rare: Machined cosmic + sunpillar holo
 * - emerald-rare: Machined emerald + sunpillar holo
 * - flat-rare: Flat border + sunpillar holo
 * - frameless-rare: No frame + sunpillar holo
 * - plain-rare: Machined blue-chrome + no holo
 * - radiant-rare: Machined blue-chrome + radiant holo
 * - gold-rare: Machined blue-chrome + secret-gold holo
 *
 * SUPER_RARE (8):
 * - classic-super-rare: Machined gold + secret-gold holo
 * - prismatic-super-rare: Machined prismatic + secret-gold holo
 * - diamond-super-rare: Machined diamond + secret-gold holo
 * - flat-super-rare: Flat border + secret-gold holo
 * - frameless-super-rare: No frame + secret-gold holo
 * - plain-super-rare: Machined gold + no holo
 * - radiant-super-rare: Machined gold + radiant holo
 * - sunpillar-super-rare: Machined gold + sunpillar holo
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
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(135deg, #9ca3af, #6b7280, #9ca3af)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'carbon-normal': {
    id: 'carbon-normal',
    name: 'Carbon Fiber',
    nameJa: 'カーボンファイバー',
    rarity: 'NORMAL',
    cssClass: 'card-carbon',
    effects: [],
    borderColor: '#374151',
    previewGradient: 'linear-gradient(135deg, #1f2937, #374151, #1f2937)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'minimal-normal': {
    id: 'minimal-normal',
    name: 'Clean Minimal',
    nameJa: 'クリーンミニマル',
    rarity: 'NORMAL',
    cssClass: 'card-minimal',
    effects: [],
    borderColor: '#e5e7eb',
    previewGradient: 'linear-gradient(135deg, #f3f4f6, #e5e7eb, #f3f4f6)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'flat-normal': {
    id: 'flat-normal',
    name: 'Flat Silver',
    nameJa: 'フラットシルバー',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
    frameStyle: 'flat',
    holoEffect: 'radiant',
  },
  'frameless-normal': {
    id: 'frameless-normal',
    name: 'Frameless Holo',
    nameJa: 'フレームレスホロ',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: 'transparent',
    previewGradient: 'linear-gradient(135deg, #1f2937, #111827)',
    frameStyle: 'none',
    holoEffect: 'radiant',
  },
  'plain-normal': {
    id: 'plain-normal',
    name: 'Plain Silver',
    nameJa: 'プレーンシルバー',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(135deg, #9ca3af, #6b7280)',
    frameStyle: 'machined',
    holoEffect: 'none',
  },
  'flat-plain-normal': {
    id: 'flat-plain-normal',
    name: 'Flat Plain',
    nameJa: 'フラットプレーン',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: '#4b5563',
    previewGradient: 'linear-gradient(180deg, #374151, #1f2937)',
    frameStyle: 'flat',
    holoEffect: 'none',
  },
  'frameless-plain-normal': {
    id: 'frameless-plain-normal',
    name: 'Frameless Plain',
    nameJa: 'フレームレスプレーン',
    rarity: 'NORMAL',
    cssClass: 'card-normal',
    effects: [],
    borderColor: 'transparent',
    previewGradient: 'linear-gradient(180deg, #111827, #0a0a0f)',
    frameStyle: 'none',
    holoEffect: 'none',
  },

  // --- RARE ---
  'classic-rare': {
    id: 'classic-rare',
    name: 'Electric Blue',
    nameJa: 'エレクトリックブルー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'shine'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #60a5fa, #3b82f6, #6366f1)',
    frameStyle: 'machined',
    holoEffect: 'sunpillar',
  },
  'cosmic-rare': {
    id: 'cosmic-rare',
    name: 'Cosmic Purple',
    nameJa: 'コズミックパープル',
    rarity: 'RARE',
    cssClass: 'card-cosmic',
    effects: ['glow', 'stars'],
    borderColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    previewGradient: 'linear-gradient(135deg, #c084fc, #a855f7, #ec4899)',
    frameStyle: 'machined',
    holoEffect: 'sunpillar',
  },
  'emerald-rare': {
    id: 'emerald-rare',
    name: 'Emerald Glow',
    nameJa: 'エメラルドグロウ',
    rarity: 'RARE',
    cssClass: 'card-emerald',
    effects: ['glow', 'nature'],
    borderColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    previewGradient: 'linear-gradient(135deg, #34d399, #10b981, #059669)',
    frameStyle: 'machined',
    holoEffect: 'sunpillar',
  },
  'flat-rare': {
    id: 'flat-rare',
    name: 'Flat Blue',
    nameJa: 'フラットブルー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    frameStyle: 'flat',
    holoEffect: 'sunpillar',
  },
  'frameless-rare': {
    id: 'frameless-rare',
    name: 'Frameless Rainbow',
    nameJa: 'フレームレスレインボー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow'],
    borderColor: 'transparent',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #1e3a5f, #1e1b4b)',
    frameStyle: 'none',
    holoEffect: 'sunpillar',
  },
  'plain-rare': {
    id: 'plain-rare',
    name: 'Plain Blue',
    nameJa: 'プレーンブルー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    frameStyle: 'machined',
    holoEffect: 'none',
  },
  'radiant-rare': {
    id: 'radiant-rare',
    name: 'Radiant Blue',
    nameJa: 'ラディアントブルー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'shine'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #60a5fa, #9ca3af, #6366f1)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'gold-rare': {
    id: 'gold-rare',
    name: 'Gold Blue',
    nameJa: 'ゴールドブルー',
    rarity: 'RARE',
    cssClass: 'card-rare',
    effects: ['glow', 'shine'],
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #3b82f6, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'secret-gold',
  },

  // --- SUPER_RARE ---
  'classic-super-rare': {
    id: 'classic-super-rare',
    name: 'Golden Hologram',
    nameJa: 'ゴールデンホログラム',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'hologram', 'sparkle'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #f472b6, #a78bfa)',
    frameStyle: 'machined',
    holoEffect: 'secret-gold',
  },
  'prismatic-super-rare': {
    id: 'prismatic-super-rare',
    name: 'Rainbow Prismatic',
    nameJa: 'レインボープリズム',
    rarity: 'SUPER_RARE',
    cssClass: 'card-prismatic',
    effects: ['glow', 'prismatic', 'sparkle'],
    borderColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.5)',
    previewGradient: 'linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa, #34d399, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'secret-gold',
  },
  'diamond-super-rare': {
    id: 'diamond-super-rare',
    name: 'Diamond Frost',
    nameJa: 'ダイヤモンドフロスト',
    rarity: 'SUPER_RARE',
    cssClass: 'card-diamond',
    effects: ['glow', 'frost', 'sparkle'],
    borderColor: '#67e8f9',
    glowColor: 'rgba(103, 232, 249, 0.5)',
    previewGradient: 'linear-gradient(135deg, #67e8f9, #a5f3fc, #e0f2fe, #67e8f9)',
    frameStyle: 'machined',
    holoEffect: 'secret-gold',
  },
  'flat-super-rare': {
    id: 'flat-super-rare',
    name: 'Flat Gold',
    nameJa: 'フラットゴールド',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'sparkle'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #b45309)',
    frameStyle: 'flat',
    holoEffect: 'secret-gold',
  },
  'frameless-super-rare': {
    id: 'frameless-super-rare',
    name: 'Frameless Gold',
    nameJa: 'フレームレスゴールド',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'sparkle'],
    borderColor: 'transparent',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #44337a, #831843)',
    frameStyle: 'none',
    holoEffect: 'secret-gold',
  },
  'plain-super-rare': {
    id: 'plain-super-rare',
    name: 'Plain Gold',
    nameJa: 'プレーンゴールド',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    frameStyle: 'machined',
    holoEffect: 'none',
  },
  'radiant-super-rare': {
    id: 'radiant-super-rare',
    name: 'Radiant Gold',
    nameJa: 'ラディアントゴールド',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'sparkle'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #9ca3af, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'radiant',
  },
  'sunpillar-super-rare': {
    id: 'sunpillar-super-rare',
    name: 'Sunpillar Gold',
    nameJa: 'サンピラーゴールド',
    rarity: 'SUPER_RARE',
    cssClass: 'card-super-rare',
    effects: ['glow', 'sparkle'],
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    previewGradient: 'linear-gradient(135deg, #fbbf24, #60a5fa, #f472b6, #fbbf24)',
    frameStyle: 'machined',
    holoEffect: 'sunpillar',
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
