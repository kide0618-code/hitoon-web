'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Card {
  id: string;
  name: string;
  rarity: 'NORMAL' | 'RARE' | 'SUPER_RARE';
  price: number;
  total_supply: number | null;
  current_supply: number;
  is_active: boolean;
}

interface Visual {
  id: string;
  artist_id: string;
  name: string;
  artist_image_url: string;
  song_title: string | null;
  subtitle: string | null;
  is_active: boolean;
  created_at: string;
  artist: { id: string; name: string };
  cards: Card[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVisualPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visual, setVisual] = useState<Visual | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    artist_image_url: '',
    song_title: '',
    subtitle: '',
    is_active: true,
  });

  useEffect(() => {
    const fetchVisual = async () => {
      try {
        const res = await fetch(`/api/admin/visuals/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch visual');
        }

        setVisual(data.visual);
        setFormData({
          name: data.visual.name,
          artist_image_url: data.visual.artist_image_url,
          song_title: data.visual.song_title || '',
          subtitle: data.visual.subtitle || '',
          is_active: data.visual.is_active,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisual();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/visuals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update visual');
      }

      router.push('/admin/visuals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this visual? This will also delete all associated cards.',
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/visuals/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete visual');
      }

      router.push('/admin/visuals');
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
            <div className="h-40 rounded bg-gray-800" />
            <div className="h-10 rounded bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!visual) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
          Visual not found
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <a href="/admin/visuals" className="text-gray-500 transition-colors hover:text-white">
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-white">Edit Visual</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Visual Info</h2>
            <span className="text-sm text-gray-500">Artist: {visual.artist.name}</span>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Visual Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 1st Album, Summer Single"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Card Image URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.artist_image_url}
              onChange={(e) => setFormData({ ...formData, artist_image_url: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com/card-image.jpg"
            />
            {formData.artist_image_url && (
              <div className="mt-3">
                <Image
                  src={formData.artist_image_url}
                  alt="Preview"
                  width={128}
                  height={171}
                  className="aspect-[3/4] h-auto w-32 rounded-lg object-cover"
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
            <label className="mb-2 block text-sm font-medium text-gray-300">Song Title</label>
            <input
              type="text"
              value={formData.song_title}
              onChange={(e) => setFormData({ ...formData, song_title: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Optional song title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Optional subtitle"
            />
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
                Active (visible in marketplace)
              </span>
            </label>
          </div>
        </div>

        {/* Associated Cards */}
        <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Associated Cards</h2>
            <a
              href={`/admin/cards/new?visual_id=${visual.id}&artist_id=${visual.artist_id}`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              + Add Card
            </a>
          </div>

          {visual.cards.length > 0 ? (
            <div className="space-y-2">
              {visual.cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-lg bg-gray-800 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${rarityStyles[card.rarity]}`}
                    >
                      {rarityLabels[card.rarity]}
                    </span>
                    <span className="text-white">{card.name}</span>
                    {!card.is_active && (
                      <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">¥{card.price.toLocaleString()}</span>
                    <span className="font-mono text-sm text-gray-500">
                      {card.current_supply}
                      {card.total_supply !== null && ` / ${card.total_supply}`}
                    </span>
                    <a
                      href={`/admin/cards/${card.id}`}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No cards created yet. Click &quot;+ Add Card&quot; to create cards for this visual.
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
            <a href="/admin/visuals" className="text-gray-400 transition-colors hover:text-white">
              Cancel
            </a>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-900/50 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-900 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Visual'}
          </button>
        </div>
      </form>
    </div>
  );
}
