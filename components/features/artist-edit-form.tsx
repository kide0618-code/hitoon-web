'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  type SocialLinksFormData,
  createEmptySocialLinksData,
  parseSocialLinksFromApi,
  buildSocialLinksPayload,
  SocialLinksFormSection,
} from '@/components/features/social-links-form';

interface Artist {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  note: string | null;
  member_count: number;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  archived_at: string | null;
}

interface SaleItem {
  card_id: string;
  card_name: string;
  rarity: string;
  quantity: number;
  revenue: number;
}

interface PayoutData {
  sales: SaleItem[];
  totals: { quantity: number; revenue: number };
  payout: { status: string; note: string };
}

type PayoutStatus = 'pending' | 'transferred' | 'confirmed';

const PAYOUT_STATUS_CONFIG: Record<PayoutStatus, { label: string; badgeClass: string }> = {
  pending: { label: '未対応', badgeClass: 'bg-yellow-900/50 text-yellow-400 border-yellow-700' },
  transferred: {
    label: '振り込み済み',
    badgeClass: 'bg-blue-900/50 text-blue-400 border-blue-700',
  },
  confirmed: {
    label: '入金確認完了',
    badgeClass: 'bg-green-900/50 text-green-400 border-green-700',
  },
};

function getJSTNow() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return { year: jst.getUTCFullYear(), month: jst.getUTCMonth() + 1 };
}

interface ArtistEditFormProps {
  artistId: string;
  onClose: () => void;
}

export function ArtistEditForm({ artistId, onClose }: ArtistEditFormProps) {
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
    note: '',
    is_featured: false,
    display_order: 0,
  });

  const [socialLinksData, setSocialLinksData] = useState<SocialLinksFormData>(
    createEmptySocialLinksData(),
  );

  // Payout state
  const jstNow = getJSTNow();
  const [payoutYear, setPayoutYear] = useState(jstNow.year);
  const [payoutMonth, setPayoutMonth] = useState(jstNow.month);
  const [payoutData, setPayoutData] = useState<PayoutData | null>(null);
  const [isLoadingPayout, setIsLoadingPayout] = useState(false);
  const [isSavingPayout, setIsSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutStatus, setPayoutStatus] = useState<PayoutStatus>('pending');
  const [payoutNote, setPayoutNote] = useState('');

  const fetchPayoutData = useCallback(async (id: string, year: number, month: number) => {
    setIsLoadingPayout(true);
    setPayoutError(null);
    try {
      const res = await fetch(`/api/admin/artists/${id}/payouts?year=${year}&month=${month}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch payout data');
      setPayoutData(data);
      setPayoutStatus(data.payout.status as PayoutStatus);
      setPayoutNote(data.payout.note || '');
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : 'Failed to fetch payout data');
    } finally {
      setIsLoadingPayout(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && artist) {
      fetchPayoutData(artistId, payoutYear, payoutMonth);
    }
  }, [isLoading, artist, artistId, payoutYear, payoutMonth, fetchPayoutData]);

  const handleSavePayout = async () => {
    setIsSavingPayout(true);
    setPayoutError(null);
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/payouts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: payoutYear,
          month: payoutMonth,
          payout_status: payoutStatus,
          note: payoutNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save payout');
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : 'Failed to save payout');
    } finally {
      setIsSavingPayout(false);
    }
  };

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`/api/admin/artists/${artistId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch artist');
        }

        setArtist(data.artist);
        setFormData({
          name: data.artist.name,
          description: data.artist.description || '',
          image_url: data.artist.image_url || '',
          note: data.artist.note || '',
          is_featured: data.artist.is_featured,
          display_order: data.artist.display_order,
        });

        if (data.social_links) {
          setSocialLinksData(parseSocialLinksFromApi(data.social_links));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

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

      setFormData((prev) => ({ ...prev, image_url: data.url }));
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
      const res = await fetch(`/api/admin/artists/${artistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          social_links: buildSocialLinksPayload(socialLinksData),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update artist');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'このアーティストを契約終了にしますか？\nユーザー向けページには表示されなくなりますが、管理画面には残ります。',
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/artists/${artistId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete artist');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/3 rounded bg-gray-800" />
        <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="h-10 rounded bg-gray-800" />
          <div className="h-24 rounded bg-gray-800" />
          <div className="h-10 rounded bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
        Artist not found
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between pr-12">
        <h2 className="text-2xl font-bold text-white">Edit Artist</h2>
        <a
          href={`/artists/${artistId}`}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Artist name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Artist description"
            />
          </div>

          {/* Note (operator only) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              メモ <span className="text-xs text-gray-500">（管理者のみ表示）</span>
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="管理用メモ（ユーザーには表示されません）"
            />
          </div>

          {/* Image */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">Image</label>
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
                ) : formData.image_url ? (
                  <div>
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="mx-auto mb-2 h-24 w-24 rounded-full object-cover"
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
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
            )}

            {imageInputMode === 'url' && formData.image_url && (
              <div className="mt-3">
                <Image
                  src={formData.image_url}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                  unoptimized
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
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-5 w-5 rounded border border-gray-700 bg-gray-800 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-300">「Featured」に表示する</span>
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                表示順 ※数字が小さいほど前に表示されます
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
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                min="0"
              />
            </div>
          </div>

          {/* Read-only stats */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="mb-3 text-sm font-medium text-gray-500">Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Members:</span>
                <span className="ml-2 text-white">{artist.member_count.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-white">
                  {new Date(artist.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <SocialLinksFormSection value={socialLinksData} onChange={setSocialLinksData} />

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
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>

          {!artist.archived_at && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-900/50 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-900 disabled:opacity-50"
            >
              {isDeleting ? '処理中...' : '契約終了にする'}
            </button>
          )}
          {artist.archived_at && (
            <span className="rounded-lg border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-400">
              契約終了済み（{new Date(artist.archived_at).toLocaleDateString('ja-JP')}）
            </span>
          )}
        </div>
      </form>

      {/* Monthly Sales & Payout Section */}
      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-bold text-white">月次売上 & 支払い管理</h2>

        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <select
            value={payoutYear}
            onChange={(e) => setPayoutYear(parseInt(e.target.value))}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            {Array.from({ length: 5 }, (_, i) => jstNow.year - 2 + i).map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
          <select
            value={payoutMonth}
            onChange={(e) => setPayoutMonth(parseInt(e.target.value))}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>

        {payoutError && (
          <div className="rounded-lg border border-red-700 bg-red-900/50 px-4 py-3 text-red-400">
            {payoutError}
          </div>
        )}

        {isLoadingPayout ? (
          <div className="animate-pulse space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="h-6 w-1/4 rounded bg-gray-800" />
            <div className="h-32 rounded bg-gray-800" />
          </div>
        ) : (
          payoutData && (
            <>
              {/* Sales Table */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-sm font-medium text-gray-300">売上明細</h3>
                {payoutData.sales.length === 0 ? (
                  <p className="text-sm text-gray-500">この月の売上はありません</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-500">
                          <th className="pb-2 font-medium">カード名</th>
                          <th className="pb-2 font-medium">レアリティ</th>
                          <th className="pb-2 text-right font-medium">販売数</th>
                          <th className="pb-2 text-right font-medium">売上</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payoutData.sales.map((sale) => (
                          <tr key={sale.card_id} className="border-b border-gray-800/50">
                            <td className="py-2 text-white">{sale.card_name}</td>
                            <td className="py-2">
                              <span
                                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                  sale.rarity === 'SUPER_RARE'
                                    ? 'bg-yellow-900/50 text-yellow-400'
                                    : sale.rarity === 'RARE'
                                      ? 'bg-blue-900/50 text-blue-400'
                                      : 'bg-gray-700 text-gray-300'
                                }`}
                              >
                                {sale.rarity === 'SUPER_RARE'
                                  ? 'SR'
                                  : sale.rarity === 'RARE'
                                    ? 'R'
                                    : 'N'}
                              </span>
                            </td>
                            <td className="py-2 text-right text-white">{sale.quantity}</td>
                            <td className="py-2 text-right text-white">
                              ¥{sale.revenue.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-700 font-bold">
                          <td className="pt-3 text-white" colSpan={2}>
                            合計
                          </td>
                          <td className="pt-3 text-right text-white">
                            {payoutData.totals.quantity}
                          </td>
                          <td className="pt-3 text-right text-white">
                            ¥{payoutData.totals.revenue.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Payout Status & Note */}
              <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="text-sm font-medium text-gray-300">支払いステータス</h3>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">ステータス</label>
                  <div className="flex items-center gap-3">
                    <select
                      value={payoutStatus}
                      onChange={(e) => setPayoutStatus(e.target.value as PayoutStatus)}
                      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      {(
                        Object.entries(PAYOUT_STATUS_CONFIG) as [
                          PayoutStatus,
                          { label: string; badgeClass: string },
                        ][]
                      ).map(([value, config]) => (
                        <option key={value} value={value}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                    <span
                      className={`rounded border px-2 py-1 text-xs font-medium ${PAYOUT_STATUS_CONFIG[payoutStatus].badgeClass}`}
                    >
                      {PAYOUT_STATUS_CONFIG[payoutStatus].label}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    メモ（請求情報・担当者・配分など）
                  </label>
                  <textarea
                    value={payoutNote}
                    onChange={(e) => setPayoutNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                    placeholder="請求先、担当者名、配分率などを記入..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSavePayout}
                  disabled={isSavingPayout}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
                >
                  {isSavingPayout ? '保存中...' : '支払い情報を保存'}
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
