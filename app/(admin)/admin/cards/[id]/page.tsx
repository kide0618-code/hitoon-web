'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ExclusiveContent {
  id: string;
  type: 'video' | 'music' | 'image';
  url: string;
  title: string;
  description: string | null;
  display_order: number;
}

interface Card {
  id: string;
  template_id: string;
  artist_id: string;
  name: string;
  description: string | null;
  rarity: 'NORMAL' | 'RARE' | 'SUPER_RARE';
  price: number;
  total_supply: number | null;
  current_supply: number;
  max_purchase_per_user: number | null;
  is_active: boolean;
  created_at: string;
  template: {
    id: string;
    name: string;
    artist_image_url: string;
  };
  artist: {
    id: string;
    name: string;
  };
  exclusive_contents: ExclusiveContent[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditCardPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<Card | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    total_supply: null as number | null,
    max_purchase_per_user: null as number | null,
    is_active: true,
  });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/admin/cards/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch card');
        }

        setCard(data.card);
        setFormData({
          name: data.card.name,
          description: data.card.description || '',
          price: data.card.price,
          total_supply: data.card.total_supply,
          max_purchase_per_user: data.card.max_purchase_per_user,
          is_active: data.card.is_active,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
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
      <div className="mx-auto max-w-3xl">
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
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
          Card not found
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <a href="/admin/cards" className="text-gray-500 transition-colors hover:text-white">
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-white">Edit Card</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-lg">
              <Image
                src={card.template.artist_image_url}
                alt={card.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Artist</span>
                <span className="text-white">{card.artist.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Template</span>
                <span className="text-white">{card.template.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Rarity</span>
                <span
                  className={`rounded px-2 py-1 text-xs font-bold ${rarityStyles[card.rarity]}`}
                >
                  {rarityLabels[card.rarity]}
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

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
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
            </div>

            {/* Exclusive Contents */}
            <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Exclusive Contents</h2>
                <a
                  href={`/admin/cards/${card.id}/contents/new`}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  + Add Content
                </a>
              </div>

              {card.exclusive_contents.length > 0 ? (
                <div className="space-y-2">
                  {card.exclusive_contents.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between rounded-lg bg-gray-800 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            content.type === 'video'
                              ? 'bg-red-900/50 text-red-400'
                              : content.type === 'music'
                                ? 'bg-green-900/50 text-green-400'
                                : 'bg-blue-900/50 text-blue-400'
                          }`}
                        >
                          {content.type}
                        </span>
                        <span className="text-white">{content.title}</span>
                      </div>
                      <a
                        href={`/admin/cards/${card.id}/contents/${content.id}`}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </a>
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
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <a href="/admin/cards" className="text-gray-400 transition-colors hover:text-white">
                  Cancel
                </a>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || card.current_supply > 0}
                className="rounded-lg bg-red-900/50 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                title={
                  card.current_supply > 0 ? 'Cannot delete card with purchases' : 'Delete card'
                }
              >
                {isDeleting ? 'Deleting...' : 'Delete Card'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
