'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type ContentType = 'image' | 'text' | 'video' | 'music';

interface PageProps {
  params: Promise<{ id: string; contentId: string }>;
}

export default function EditContentPage({ params }: PageProps) {
  const { id: cardId, contentId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'image' as ContentType,
    url: '',
    title: '',
    description: '',
    display_order: 0,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/admin/cards/${cardId}/contents/${contentId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch content');
        }

        setFormData({
          type: data.content.type,
          url: data.content.url || '',
          title: data.content.title,
          description: data.content.description || '',
          display_order: data.content.display_order,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [cardId, contentId]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'contents');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData((prev) => ({ ...prev, url: data.url }));
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
      const res = await fetch(`/api/admin/cards/${cardId}/contents/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update content');
      }

      router.push(`/admin/cards/${cardId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このコンテンツを削除しますか？')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cards/${cardId}/contents/${contentId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete content');
      }

      router.push(`/admin/cards/${cardId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-gray-800" />
          <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="h-10 rounded bg-gray-800" />
            <div className="h-24 rounded bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  const needsUrl = formData.type !== 'text';

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <a
          href={`/admin/cards/${cardId}`}
          className="text-gray-500 transition-colors hover:text-white"
        >
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-white">Edit Content</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          {/* Type Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              タイプ <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(
                [
                  { value: 'image', label: '画像', icon: '🖼️' },
                  { value: 'text', label: 'テキスト', icon: '📝' },
                  { value: 'video', label: '動画', icon: '🎬' },
                  { value: 'music', label: '音楽', icon: '🎵' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: opt.value })}
                  className={`rounded-lg border-2 p-3 text-center transition-all ${
                    formData.type === opt.value
                      ? 'border-blue-500 bg-gray-800'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <p className="mt-1 text-xs text-white">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              タイトル <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="コンテンツのタイトル"
            />
          </div>

          {/* Image Upload (for image type) */}
          {formData.type === 'image' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                画像 <span className="text-red-400">*</span>
              </label>
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
                ) : formData.url ? (
                  <div>
                    <Image
                      src={formData.url}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="mx-auto mb-2 max-h-48 rounded-lg object-contain"
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
            </div>
          )}

          {/* URL (for video/music) */}
          {(formData.type === 'video' || formData.type === 'music') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                required={needsUrl}
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="https://youtube.com/... or https://..."
              />
            </div>
          )}

          {/* Description / Text Content */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {formData.type === 'text' ? (
                <>
                  テキスト内容 <span className="text-red-400">*</span>
                </>
              ) : (
                '説明（任意）'
              )}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required={formData.type === 'text'}
              rows={formData.type === 'text' ? 8 : 3}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder={
                formData.type === 'text' ? '購入者に表示するテキストを入力...' : '任意の説明文'
              }
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">表示順</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">数字が小さいほど前に表示されます</p>
          </div>
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
            <a
              href={`/admin/cards/${cardId}`}
              className="text-gray-400 transition-colors hover:text-white"
            >
              Cancel
            </a>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-900/50 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-900 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </form>
    </div>
  );
}
