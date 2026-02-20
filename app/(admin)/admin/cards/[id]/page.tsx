'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  getFrameTemplate,
  getFrameTemplatesByRarity,
  getDefaultFrameForRarity,
} from '@/config/frame-templates';
import { ArtistCard } from '@/components/cards/artist-card';
import type { Rarity } from '@/types/card';

interface ExclusiveContent {
  id: string;
  type: 'video' | 'music' | 'image';
  url: string;
  title: string;
  description: string | null;
  display_order: number;
  archived_at: string | null;
}

interface Card {
  id: string;
  artist_id: string;
  name: string;
  description: string | null;
  rarity: Rarity;
  price: number;
  total_supply: number | null;
  current_supply: number;
  max_purchase_per_user: number | null;
  is_active: boolean;
  archived_at: string | null;
  sale_ends_at: string | null;
  card_image_url: string;
  song_title: string | null;
  subtitle: string | null;
  frame_template_id: string;
  created_at: string;
  artist: {
    id: string;
    name: string;
  };
  exclusive_contents: ExclusiveContent[];
}

interface Artist {
  id: string;
  name: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditCardPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    artist_id: '',
    rarity: 'NORMAL' as Rarity,
    price: 0,
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
        const [cardRes, artistsRes] = await Promise.all([
          fetch(`/api/admin/cards/${id}`),
          fetch('/api/artists'),
        ]);

        const cardData = await cardRes.json();
        if (!cardRes.ok) {
          throw new Error(cardData.error || 'Failed to fetch card');
        }

        const artistsData = await artistsRes.json();
        setArtists(Array.isArray(artistsData) ? artistsData : artistsData.artists || []);

        setCard(cardData.card);
        // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:MM)
        let saleEndsAtLocal = '';
        if (cardData.card.sale_ends_at) {
          const d = new Date(cardData.card.sale_ends_at);
          saleEndsAtLocal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }

        setFormData({
          name: cardData.card.name,
          description: cardData.card.description || '',
          artist_id: cardData.card.artist_id,
          rarity: cardData.card.rarity,
          price: cardData.card.price,
          total_supply: cardData.card.total_supply,
          max_purchase_per_user: cardData.card.max_purchase_per_user,
          is_active: cardData.card.is_active,
          card_image_url: cardData.card.card_image_url || '',
          song_title: cardData.card.song_title || '',
          subtitle: cardData.card.subtitle || '',
          frame_template_id: cardData.card.frame_template_id || 'normal-frame-radiant',
          sale_ends_at: saleEndsAtLocal,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    setIsSaving(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        ...formData,
        sale_ends_at: formData.sale_ends_at ? new Date(formData.sale_ends_at).toISOString() : null,
      };
      // Only send artist_id/rarity if card has no purchases (editable)
      if (card && card.current_supply > 0) {
        delete payload.artist_id;
        delete payload.rarity;
      }

      const res = await fetch(`/api/admin/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update card');
      }

      router.push('/admin/cards');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'このカードをアーカイブしますか？\nユーザー向けページには表示されなくなりますが、管理画面には残ります。',
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cards/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete card');
      }

      router.push('/admin/cards');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateContent = async () => {
    setIsCreatingContent(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cards/${id}/contents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image',
          title: '(下書き)',
          url: '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create content');
      }

      router.push(`/admin/cards/${id}/contents/${data.content.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsCreatingContent(false);
    }
  };

  const rarityStyles: Record<string, string> = {
    NORMAL: 'bg-gray-800 text-gray-400',
    RARE: 'bg-blue-900/50 text-blue-400',
    SUPER_RARE: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black',
  };

  const rarityLabels: Record<string, string> = {
    NORMAL: 'N',
    RARE: 'R',
    SUPER_RARE: 'SR',
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-gray-800" />
          <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="h-10 rounded bg-gray-800" />
            <div className="h-24 rounded bg-gray-800" />
            <div className="h-10 rounded bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
          Card not found
        </div>
      </div>
    );
  }

  const canEditArtistAndRarity = card.current_supply === 0;
  const currentRarity = formData.rarity;
  const selectedArtist = artists.find((a) => a.id === formData.artist_id) || card.artist;
  const frameTemplate =
    getFrameTemplate(formData.frame_template_id) || getFrameTemplate(card.frame_template_id);
  const filteredFrameTemplates = getFrameTemplatesByRarity(currentRarity);

  const handleRarityChange = (rarity: Rarity) => {
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
    const defaultFrame = getDefaultFrameForRarity(rarity);
    setFormData((prev) => ({
      ...prev,
      rarity,
      price: defaultPrices[rarity],
      total_supply: defaultSupply[rarity],
      frame_template_id: defaultFrame.id,
    }));
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/admin/cards" className="text-gray-500 transition-colors hover:text-white">
            ← Back
          </a>
          <h1 className="text-2xl font-bold text-white">Edit Card</h1>
        </div>
        <a
          href={`/artists/${selectedArtist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          ユーザー表示ページを見る ↗
        </a>
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
              {formData.card_image_url ? (
                <ArtistCard
                  artistName={selectedArtist.name}
                  artistImageUrl={formData.card_image_url}
                  songTitle={formData.song_title || null}
                  rarity={currentRarity}
                  frameTemplateId={formData.frame_template_id}
                  serialNumber={card.current_supply > 0 ? 1 : undefined}
                  totalSupply={formData.total_supply}
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-gray-800">
                  <span className="text-sm text-gray-500">画像URLを入力してください</span>
                </div>
              )}
            </div>
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
                    className={`rounded px-2 py-1 text-xs font-bold ${rarityStyles[currentRarity]}`}
                  >
                    {rarityLabels[currentRarity]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Sold</span>
                  <span className="font-mono text-white">
                    {card.current_supply}
                    {card.total_supply !== null && ` / ${card.total_supply}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
              {/* Artist Selection (only when no purchases) */}
              {canEditArtistAndRarity && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Artist <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.artist_id}
                    onChange={(e) => setFormData({ ...formData, artist_id: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rarity Selection (only when no purchases) */}
              {canEditArtistAndRarity && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Rarity <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['NORMAL', 'RARE', 'SUPER_RARE'] as const).map((rarity) => (
                      <button
                        key={rarity}
                        type="button"
                        onClick={() => handleRarityChange(rarity)}
                        className={`rounded-lg border-2 p-3 transition-all ${
                          currentRarity === rarity
                            ? (rarity === 'NORMAL'
                                ? 'border-gray-700'
                                : rarity === 'RARE'
                                  ? 'border-blue-500'
                                  : 'border-yellow-400') + ' bg-gray-800'
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
              )}

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

              {/* Frame Template Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  フレームテンプレート
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                    min={card.current_supply || 1}
                    placeholder="無制限"
                  />
                  {card.current_supply > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      最小値: {card.current_supply} (販売済み)
                    </p>
                  )}
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

            {/* Exclusive Contents */}
            <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Exclusive Contents</h2>
                <button
                  type="button"
                  onClick={handleCreateContent}
                  disabled={isCreatingContent}
                  className="text-sm text-blue-400 transition-colors hover:text-blue-300 disabled:text-blue-800"
                >
                  {isCreatingContent ? '作成中...' : '+ Add Content'}
                </button>
              </div>

              {card.exclusive_contents.length > 0 ? (
                <div className="space-y-2">
                  {card.exclusive_contents.map((content) => (
                    <div
                      key={content.id}
                      className={`flex items-center justify-between rounded-lg bg-gray-800 p-3 ${content.archived_at ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            content.archived_at
                              ? 'bg-red-900/50 text-red-400'
                              : content.type === 'video'
                                ? 'bg-red-900/50 text-red-400'
                                : content.type === 'music'
                                  ? 'bg-green-900/50 text-green-400'
                                  : 'bg-blue-900/50 text-blue-400'
                          }`}
                        >
                          {content.archived_at ? 'Archived' : content.type}
                        </span>
                        <span
                          className={
                            content.archived_at ? 'text-gray-500 line-through' : 'text-white'
                          }
                        >
                          {content.title}
                        </span>
                      </div>
                      {!content.archived_at && (
                        <a
                          href={`/admin/cards/${card.id}/contents/${content.id}`}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No exclusive contents yet. Click &quot;+ Add Content&quot; to add bonus content
                  for this card.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <a href="/admin/cards" className="text-gray-400 transition-colors hover:text-white">
                  Cancel
                </a>
              </div>

              {!card.archived_at ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-900/50 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-900 disabled:opacity-50"
                >
                  {isDeleting ? '処理中...' : 'アーカイブする'}
                </button>
              ) : (
                <span className="rounded-lg border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-400">
                  アーカイブ済み（{new Date(card.archived_at).toLocaleDateString('ja-JP')}）
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
