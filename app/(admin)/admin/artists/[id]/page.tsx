'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';

interface Artist {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  member_count: number;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArtistPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_featured: false,
    display_order: 0,
  });

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`/api/admin/artists/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch artist');
        }

        setArtist(data.artist);
        setFormData({
          name: data.artist.name,
          description: data.artist.description || '',
          image_url: data.artist.image_url || '',
          is_featured: data.artist.is_featured,
          display_order: data.artist.display_order,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'artists');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData({ ...formData, image_url: data.url });
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
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update artist');
      }

      router.push('/admin/artists');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this artist? This will also delete all associated templates and cards.'
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete artist');
      }

      router.push('/admin/artists');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/3" />
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="h-10 bg-gray-800 rounded" />
            <div className="h-24 bg-gray-800 rounded" />
            <div className="h-10 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          Artist not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <a
          href="/admin/artists"
          className="text-gray-500 hover:text-white transition-colors"
        >
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-white">Edit Artist</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Artist name"
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
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Artist description"
            />
          </div>

          {/* Image */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Image
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
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
                  className={`text-xs px-3 py-1 rounded transition-colors ${
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
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
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
                      className="animate-spin h-8 w-8 mx-auto mb-2"
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
                ) : formData.image_url ? (
                  <div>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-400">
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
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
                    <p className="text-xs text-gray-500 mt-1">
                      JPEG, PNG, WebP, GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            )}

            {imageInputMode === 'url' && formData.image_url && (
              <div className="mt-3">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Featured & Display Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="w-5 h-5 bg-gray-800 border border-gray-700 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-300">
                  Featured on Home
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                min="0"
              />
            </div>
          </div>

          {/* Read-only stats */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Members:</span>
                <span className="text-white ml-2">
                  {artist.member_count.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="text-white ml-2">
                  {new Date(artist.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <a
              href="/admin/artists"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </a>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-900/50 hover:bg-red-900 disabled:opacity-50 text-red-400 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Artist'}
          </button>
        </div>
      </form>
    </div>
  );
}
