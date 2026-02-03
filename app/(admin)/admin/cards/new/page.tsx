'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Artist {
  id: string;
  name: string;
}

interface Template {
  id: string;
  name: string;
  artist_id: string;
  artist: { id: string; name: string };
}

export default function NewCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const preselectedTemplateId = searchParams.get('template_id');
  const preselectedArtistId = searchParams.get('artist_id');

  const [formData, setFormData] = useState({
    template_id: preselectedTemplateId || '',
    artist_id: preselectedArtistId || '',
    name: '',
    description: '',
    rarity: 'NORMAL' as 'NORMAL' | 'RARE' | 'SUPER_RARE',
    price: 1500,
    total_supply: null as number | null,
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsRes, templatesRes] = await Promise.all([
          fetch('/api/artists'),
          fetch('/api/admin/templates-list'),
        ]);

        const artistsData = await artistsRes.json();
        setArtists(artistsData.artists || []);

        // Templates list might not exist, handle gracefully
        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData.templates || []);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Update artist_id when template changes
  useEffect(() => {
    if (formData.template_id) {
      const selectedTemplate = templates.find(
        (t) => t.id === formData.template_id
      );
      if (selectedTemplate) {
        setFormData((prev) => ({
          ...prev,
          artist_id: selectedTemplate.artist_id,
        }));
      }
    }
  }, [formData.template_id, templates]);

  // Update name when artist or rarity changes
  useEffect(() => {
    const artist = artists.find((a) => a.id === formData.artist_id);
    if (artist && formData.rarity) {
      const rarityLabel =
        formData.rarity === 'SUPER_RARE' ? 'SUPER RARE' : formData.rarity;
      setFormData((prev) => ({
        ...prev,
        name: `${artist.name} - ${rarityLabel}`,
      }));
    }
  }, [formData.artist_id, formData.rarity, artists]);

  // Update default price based on rarity
  useEffect(() => {
    const defaultPrices = {
      NORMAL: 1500,
      RARE: 3000,
      SUPER_RARE: 8000,
    };
    const defaultSupply = {
      NORMAL: null,
      RARE: 100,
      SUPER_RARE: 30,
    };
    setFormData((prev) => ({
      ...prev,
      price: defaultPrices[formData.rarity],
      total_supply: defaultSupply[formData.rarity],
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

  const filteredTemplates = formData.artist_id
    ? templates.filter((t) => t.artist_id === formData.artist_id)
    : templates;

  const rarityStyles = {
    NORMAL: 'border-gray-700',
    RARE: 'border-blue-500',
    SUPER_RARE: 'border-yellow-400',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <a
          href="/admin/cards"
          className="text-gray-500 hover:text-white transition-colors"
        >
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-white">New Card</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          {/* Artist Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.artist_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  artist_id: e.target.value,
                  template_id: '',
                })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
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

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.template_id}
              onChange={(e) =>
                setFormData({ ...formData, template_id: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              disabled={isLoadingData || !formData.artist_id}
            >
              <option value="">
                {formData.artist_id
                  ? 'Select a template'
                  : 'Select an artist first'}
              </option>
              {filteredTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rarity <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['NORMAL', 'RARE', 'SUPER_RARE'] as const).map((rarity) => (
                <button
                  key={rarity}
                  type="button"
                  onClick={() => setFormData({ ...formData, rarity })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.rarity === rarity
                      ? rarityStyles[rarity] + ' bg-gray-800'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${
                      rarity === 'NORMAL'
                        ? 'bg-gray-700 text-gray-300'
                        : rarity === 'RARE'
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    }`}
                  >
                    {rarity === 'SUPER_RARE' ? 'SR' : rarity[0]}
                  </span>
                  <p className="text-white text-sm mt-2">
                    {rarity === 'SUPER_RARE' ? 'Super Rare' : rarity}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Card name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Optional card description"
            />
          </div>

          {/* Price & Supply */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (JPY) <span className="text-red-400">*</span>
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
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Supply (empty = unlimited)
              </label>
              <input
                type="number"
                value={formData.total_supply ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_supply: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                min="1"
                placeholder="Unlimited"
              />
            </div>
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
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Card'}
          </button>
          <a
            href="/admin/cards"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
