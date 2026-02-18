'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateArtistButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '(下書き)',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create draft');
      }

      router.push(`/admin/artists/${data.artist.id}`);
    } catch {
      alert('アーティストの作成に失敗しました');
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isCreating}
      className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
    >
      {isCreating ? '作成中...' : '+ Add Artist'}
    </button>
  );
}
