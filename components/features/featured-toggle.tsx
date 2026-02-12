'use client';

import { useState } from 'react';

const OPTIONS: { value: string; label: string; className: string }[] = [
  { value: 'true', label: 'Featured', className: 'text-yellow-400 bg-yellow-900/50' },
  { value: 'false', label: '-', className: 'text-gray-500 bg-gray-800' },
];

export function FeaturedToggle({
  artistId,
  defaultValue,
}: {
  artistId: string;
  defaultValue: boolean;
}) {
  const [isFeatured, setIsFeatured] = useState(defaultValue);
  const [isSaving, setIsSaving] = useState(false);

  const current = OPTIONS.find((o) => o.value === String(isFeatured)) || OPTIONS[1];

  const handleChange = async (newValue: boolean) => {
    const prev = isFeatured;
    setIsFeatured(newValue);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/artists/${artistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: newValue }),
      });
      if (!res.ok) {
        setIsFeatured(prev);
      }
    } catch {
      setIsFeatured(prev);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <select
      value={String(isFeatured)}
      onChange={(e) => handleChange(e.target.value === 'true')}
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
