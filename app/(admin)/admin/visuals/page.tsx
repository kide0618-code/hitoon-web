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
    `
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Visual
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visuals?.map((visual) => (
          <div
            key={visual.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={visual.artist_image_url}
                alt={visual.name}
                fill
                className="object-cover"
                unoptimized
              />
              {!visual.is_active && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-gray-400">Inactive</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-white font-medium">{visual.name}</p>
              <p className="text-gray-500 text-sm">{visual.artist?.name}</p>
              {visual.song_title && (
                <p className="text-gray-600 text-xs mt-1">
                  ♪ {visual.song_title}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {visual.cards?.length || 0} cards
                </span>
                <a
                  href={`/admin/visuals/${visual.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm"
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
