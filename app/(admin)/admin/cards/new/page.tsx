'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FRAME_TEMPLATES, getFrameTemplatesByRarity } from '@/config/frame-templates';
import type { Rarity } from '@/types/card';

interface Artist {
  id: string;
  name: string;
}

export default function NewCardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    artist_id: '',
    name: '',
    description: '',
    rarity: 'NORMAL' as Rarity,
    price: 1500,
    total_supply: null as number | null,
    max_purchase_per_user: null as number | null,
    is_active: true,
    card_image_url: '',
    song_title: '',
    subtitle: '',
    frame_template_id: 'classic-normal',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/artists');
        const data = await res.json();
        setArtists(data.artists || []);
      } catch (err) {
        console.error('Failed to fetch artists:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Update name when artist or rarity changes
  useEffect(() => {
    const artist = artists.find((a) => a.id === formData.artist_id);
    if (artist && formData.rarity) {
      const rarityLabel = formData.rarity === 'SUPER_RARE' ? 'SUPER RARE' : formData.rarity;
      setFormData((prev) => ({
        ...prev,
        name: `${artist.name} - ${rarityLabel}`,
      }));
    }
  }, [formData.artist_id, formData.rarity, artists]);

  // Update default price, supply, and frame template based on rarity
  useEffect(() => {
    const defaultPrices: Record<Rarity, number> = {
      NORMAL: 1500,
      RARE: 3000,
      SUPER_RARE: 8000,
    };
    const defaultSupply: Record<Rarity, number | null> = {
      NORMAL: null,
      RARE: 100,
      SUPER_RARE: 30,
    };
    const defaultFrame: Record<Rarity, string> = {
      NORMAL: 'classic-normal',
      RARE: 'classic-rare',
      SUPER_RARE: 'classic-super-rare',
    };
    setFormData((prev) => ({
      ...prev,
      price: defaultPrices[formData.rarity],
      total_supply: defaultSupply[formData.rarity],
      frame_template_id: defaultFrame[formData.rarity],
    }));
  }, [formData.rarity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create card');
      }

      router.push('/admin/cards');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const rarityStyles = {
    NORMAL: 'border-gray-700',
    RARE: 'border-blue-500',
    SUPER_RARE: 'border-yellow-400',
  };

  const frameTemplatesForRarity = getFrameTemplatesByRarity(formData.rarity);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <a href="/admin/cards" className="text-gray-500 transition-colors hover:text-white">
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-white">New Card</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          {/* Artist Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Artist <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.artist_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  artist_id: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              disabled={isLoadingData}
            >
              <option value="">Select an artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Card Image URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              カード画像URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.card_image_url}
              onChange={(e) => setFormData({ ...formData, card_image_url: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-gray-500">
              アーティスト画像のURL（Supabase Storage等）
            </p>
          </div>

          {/* Song Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">楽曲名</label>
            <input
              type="text"
              value={formData.song_title}
              onChange={(e) => setFormData({ ...formData, song_title: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="楽曲名（任意）"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">サブタイトル</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="サブタイトル（任意）"
            />
          </div>

          {/* Rarity Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Rarity <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['NORMAL', 'RARE', 'SUPER_RARE'] as const).map((rarity) => (
                <button
                  key={rarity}
                  type="button"
                  onClick={() => setFormData({ ...formData, rarity })}
                  className={`rounded-lg border-2 p-3 transition-all ${
                    formData.rarity === rarity
                      ? rarityStyles[rarity] + ' bg-gray-800'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <span
                    className={`rounded px-2 py-1 text-xs font-bold ${
                      rarity === 'NORMAL'
                        ? 'bg-gray-700 text-gray-300'
                        : rarity === 'RARE'
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    }`}
                  >
                    {rarity === 'SUPER_RARE' ? 'SR' : rarity[0]}
                  </span>
                  <p className="mt-2 text-sm text-white">
                    {rarity === 'SUPER_RARE' ? 'Super Rare' : rarity}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Frame Template Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              フレームテンプレート <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {frameTemplatesForRarity.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, frame_template_id: template.id })}
                  className={`rounded-lg border-2 p-3 transition-all ${
                    formData.frame_template_id === template.id
                      ? 'border-blue-500 bg-gray-800'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div
                    className="mx-auto mb-2 h-8 w-full rounded"
                    style={{ background: template.previewGradient }}
                  />
                  <p className="text-xs text-white">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.nameJa}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Card Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Card name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Optional card description"
            />
          </div>

          {/* Price & Supply */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                価格 (円) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                min="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                出品数 (空欄 = 無制限)
              </label>
              <input
                type="number"
                value={formData.total_supply ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_supply: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                min="1"
                placeholder="無制限"
              />
            </div>
          </div>

          {/* Purchase Limit per User */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              1人あたりの購入上限 (空欄 = 無制限)
            </label>
            <input
              type="number"
              value={formData.max_purchase_per_user ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_purchase_per_user: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              min="1"
              placeholder="無制限"
            />
            <p className="mt-1 text-xs text-gray-500">
              1人のユーザーが購入できる最大数を設定できます
            </p>
          </div>

          {/* Is Active */}
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-5 w-5 rounded border border-gray-700 bg-gray-800 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">
                Active (available for purchase)
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
          >
            {isLoading ? 'Creating...' : 'Create Card'}
          </button>
          <a href="/admin/cards" className="text-gray-400 transition-colors hover:text-white">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
