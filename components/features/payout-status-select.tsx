'use client';

import { useState } from 'react';

type PayoutStatus = 'pending' | 'transferred' | 'confirmed';

const OPTIONS: { value: PayoutStatus; label: string; className: string }[] = [
  { value: 'pending', label: '未対応', className: 'text-yellow-400 bg-yellow-900/50' },
  { value: 'transferred', label: '振込済', className: 'text-blue-400 bg-blue-900/50' },
  { value: 'confirmed', label: '確認済', className: 'text-green-400 bg-green-900/50' },
];

export function PayoutStatusSelect({
  artistId,
  year,
  month,
  defaultStatus,
}: {
  artistId: string;
  year: number;
  month: number;
  defaultStatus: string;
}) {
  const [status, setStatus] = useState<PayoutStatus>((defaultStatus as PayoutStatus) || 'pending');
  const [isSaving, setIsSaving] = useState(false);

  const current = OPTIONS.find((o) => o.value === status) || OPTIONS[0];

  const handleChange = async (newStatus: PayoutStatus) => {
    const prev = status;
    setStatus(newStatus);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/payouts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          month,
          payout_status: newStatus,
          note: null,
        }),
      });
      if (!res.ok) {
        setStatus(prev);
      }
    } catch {
      setStatus(prev);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as PayoutStatus)}
      disabled={isSaving}
      className={`rounded border-0 px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 ${current.className}`}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
