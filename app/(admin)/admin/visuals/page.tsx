import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminVisualsPage() {
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: visuals } = (await (supabase.from('card_visuals') as any)
    .select(
      `
      *,
      artist:artists (id, name),
      cards (id)
    `,
    )
    .order('created_at', { ascending: false })) as {
    data:
      | {
          id: string;
          name: string;
          artist_image_url: string;
          song_title: string | null;
          subtitle: string | null;
          is_active: boolean;
          created_at: string;
          artist: { id: string; name: string };
          cards: { id: string }[];
        }[]
      | null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Card Visuals</h1>
        <a
          href="/admin/visuals/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          + Add Visual
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visuals?.map((visual) => (
          <div
            key={visual.id}
            className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-colors hover:border-gray-700"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={visual.artist_image_url}
                alt={visual.name}
                fill
                className="object-cover"
                unoptimized
              />
              {!visual.is_active && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-gray-400">Inactive</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-medium text-white">{visual.name}</p>
              <p className="text-sm text-gray-500">{visual.artist?.name}</p>
              {visual.song_title && (
                <p className="mt-1 text-xs text-gray-600">♪ {visual.song_title}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">{visual.cards?.length || 0} cards</span>
                <a
                  href={`/admin/visuals/${visual.id}`}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        )) || (
          <div className="col-span-full py-12 text-center text-gray-500">
            No visuals yet. Create your first visual.
          </div>
        )}
      </div>
    </div>
  );
}
