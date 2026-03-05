'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArtistEditForm } from '@/components/features/artist-edit-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArtistPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl">
      <ArtistEditForm artistId={id} onClose={() => router.push('/admin/artists')} />
    </div>
  );
}
