'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  getFrameTemplate,
  getFrameTemplatesByRarity,
  getDefaultFrameForRarity,
} from '@/config/frame-templates';
import { ArtistCard } from '@/components/cards/artist-card';
import type { Rarity } from '@/types/card';

interface Artist {
  id: string;
  name: string;
}

export default function NewCardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
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
    frame_template_id: 'normal-frame-radiant',
    sale_ends_at: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/artists');
        const data = await res.json();
        setArtists(Array.isArray(data) ? data : data.artists || []);
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

  // Update default price and supply based on rarity
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
    const defaultFrame = getDefaultFrameForRarity(formData.rarity);
    setFormData((prev) => ({
      ...prev,
      price: defaultPrices[formData.rarity],
      total_supply: defaultSupply[formData.rarity],
      frame_template_id: defaultFrame.id,
    }));
  }, [formData.rarity]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'cards');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData((prev) => ({ ...prev, card_image_url: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sale_ends_at: formData.sale_ends_at
            ? new Date(formData.sale_ends_at).toISOString()
            : null,
        }),
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

  const selectedArtist = artists.find((a) => a.id === formData.artist_id);
  const frameTemplate = getFrameTemplate(formData.frame_template_id);
  const filteredFrameTemplates = getFrameTemplatesByRarity(formData.rarity);

  return (
    <div className="mx-auto max-w-5xl">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Card Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-4 space-y-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Preview
              </p>
              {formData.card_image_url && selectedArtist ? (
                <ArtistCard
                  artistName={selectedArtist.name}
                  artistImageUrl={formData.card_image_url}
                  songTitle={formData.song_title || null}
                  rarity={formData.rarity}
                  frameTemplateId={formData.frame_template_id}
                  totalSupply={formData.total_supply}
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-gray-800">
                  <span className="text-sm text-gray-500">
                    {!selectedArtist
                      ? 'アーティストを選択してください'
                      : '画像をアップロードしてください'}
                  </span>
                </div>
              )}
            </div>
            {selectedArtist && (
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Artist</span>
                    <span className="text-white">{selectedArtist.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Frame</span>
                    <span className="text-white">
                      {frameTemplate?.name || formData.frame_template_id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Rarity</span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        formData.rarity === 'SUPER_RARE'
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                          : formData.rarity === 'RARE'
                            ? 'bg-blue-900/50 text-blue-400'
                            : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {formData.rarity === 'SUPER_RARE'
                        ? 'SR'
                        : formData.rarity === 'RARE'
                          ? 'R'
                          : 'N'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="text-white">¥{formData.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
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

              {/* Card Image */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    カード画像 <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`rounded px-3 py-1 text-xs transition-colors ${
                        imageInputMode === 'upload'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`rounded px-3 py-1 text-xs transition-colors ${
                        imageInputMode === 'url'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {imageInputMode === 'upload' ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                      isUploading
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {isUploading ? (
                      <div className="text-blue-400">
                        <svg
                          className="mx-auto mb-2 h-8 w-8 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <p>Uploading...</p>
                      </div>
                    ) : formData.card_image_url ? (
                      <div>
                        <Image
                          src={formData.card_image_url}
                          alt="Preview"
                          width={150}
                          height={200}
                          className="mx-auto mb-2 aspect-[3/4] w-[150px] rounded-lg object-cover"
                          unoptimized
                        />
                        <p className="text-sm text-gray-400">Click or drag to replace</p>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <svg
                          className="mx-auto mb-2 h-12 w-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm">Click or drag image here</p>
                        <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WebP, GIF (max 5MB)</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    value={formData.card_image_url}
                    onChange={(e) => setFormData({ ...formData, card_image_url: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://..."
                  />
                )}

                {imageInputMode === 'url' && formData.card_image_url && (
                  <div className="mt-3">
                    <Image
                      src={formData.card_image_url}
                      alt="Preview"
                      width={150}
                      height={200}
                      className="aspect-[3/4] w-[150px] rounded-lg object-cover"
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredFrameTemplates.map((template) => (
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
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="rounded bg-gray-700 px-1 py-0.5 text-[10px] text-gray-400">
                          {template.frameStyle}
                        </span>
                        <span className="rounded bg-gray-700 px-1 py-0.5 text-[10px] text-gray-400">
                          {template.holoEffect}
                        </span>
                      </div>
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

              {/* Sale Deadline */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  販売期限 (空欄 = 無期限・JST)
                </label>
                <input
                  type="datetime-local"
                  value={formData.sale_ends_at}
                  onChange={(e) => setFormData({ ...formData, sale_ends_at: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  設定した日時を過ぎると購入できなくなります
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading || isUploading}
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
      </div>
    </div>
  );
}
