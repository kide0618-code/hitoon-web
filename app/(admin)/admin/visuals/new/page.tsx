'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Artist {
  id: string;
  name: string;
}

export default function NewVisualPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(true);

  const [formData, setFormData] = useState({
    artist_id: '',
    name: '',
    artist_image_url: '',
    song_title: '',
    subtitle: '',
    is_active: true,
    auto_create_cards: true,
    cards_config: {
      normal: { price: 1500, total_supply: null as number | null },
      rare: { price: 3000, total_supply: 100 as number | null },
      super_rare: { price: 8000, total_supply: 30 as number | null },
    },
  });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch('/api/artists');
        const data = await res.json();
        setArtists(data.artists || []);
      } catch (err) {
        console.error('Failed to fetch artists:', err);
      } finally {
        setIsLoadingArtists(false);
      }
    };

    fetchArtists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/visuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create visual');
      }

      router.push('/admin/visuals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <a
          href="/admin/visuals"
          className="text-gray-500 hover:text-white transition-colors"
        >
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-white">New Visual</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">Visual Info</h2>

          {/* Artist Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.artist_id}
              onChange={(e) =>
                setFormData({ ...formData, artist_id: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              disabled={isLoadingArtists}
            >
              <option value="">Select an artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Visual Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., 1st Album, Summer Single"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Image URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.artist_image_url}
              onChange={(e) =>
                setFormData({ ...formData, artist_image_url: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/card-image.jpg"
            />
            {formData.artist_image_url && (
              <div className="mt-3">
                <Image
                  src={formData.artist_image_url}
                  alt="Preview"
                  width={128}
                  height={171}
                  className="w-32 h-auto aspect-[3/4] rounded-lg object-cover"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song Title
            </label>
            <input
              type="text"
              value={formData.song_title}
              onChange={(e) =>
                setFormData({ ...formData, song_title: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Optional song title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Optional subtitle"
            />
          </div>

          {/* Is Active */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">
                Active (visible in marketplace)
              </span>
            </label>
          </div>
        </div>

        {/* Auto-create Cards */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">
              Auto-create Cards (3 Rarities)
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.auto_create_cards}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    auto_create_cards: e.target.checked,
                  })
                }
                className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">Enable</span>
            </label>
          </div>

          {formData.auto_create_cards && (
            <div className="space-y-4">
              {/* NORMAL */}
              <div className="border border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded font-bold">
                    N
                  </span>
                  <span className="text-white font-medium">NORMAL</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Price (JPY)
                    </label>
                    <input
                      type="number"
                      value={formData.cards_config.normal.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cards_config: {
                            ...formData.cards_config,
                            normal: {
                              ...formData.cards_config.normal,
                              price: parseInt(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Supply (empty = unlimited)
                    </label>
                    <input
                      type="number"
                      value={formData.cards_config.normal.total_supply ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cards_config: {
                            ...formData.cards_config,
                            normal: {
                              ...formData.cards_config.normal,
                              total_supply: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            },
                          },
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
              </div>

              {/* RARE */}
              <div className="border border-blue-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-400 rounded font-bold">
                    R
                  </span>
                  <span className="text-white font-medium">RARE</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Price (JPY)
                    </label>
                    <input
                      type="number"
                      value={formData.cards_config.rare.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cards_config: {
                            ...formData.cards_config,
                            rare: {
                              ...formData.cards_config.rare,
                              price: parseInt(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Supply
                    </label>
                    <input
                      type="number"
                      value={formData.cards_config.rare.total_supply ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cards_config: {
                            ...formData.cards_config,
                            rare: {
                              ...formData.cards_config.rare,
                              total_supply: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            },
                          },
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
              </div>

              {/* SUPER RARE */}
              <div className="border border-purple-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded font-bold">
                    SR
                  </span>
                  <span className="text-white font-medium">SUPER RARE</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Price (JPY)
                    </label>
                    <input
                      type="number"
                      value={formData.cards_config.super_rare.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cards_config: {
                            ...formData.cards_config,
                            super_rare: {
                              ...formData.cards_config.super_rare,
                              price: parseInt(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Supply
                    </label>
                    <input
                      type="number"
                      value={formData.cards_config.super_rare.total_supply ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cards_config: {
                            ...formData.cards_config,
                            super_rare: {
                              ...formData.cards_config.super_rare,
                              total_supply: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            },
                          },
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Visual'}
          </button>
          <a
            href="/admin/visuals"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
