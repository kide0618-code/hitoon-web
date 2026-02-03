import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminTemplatesPage() {
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: templates } = (await (supabase.from('card_templates') as any)
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
        <h1 className="text-2xl font-bold text-white">Card Templates</h1>
        <a
          href="/admin/templates/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Template
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <div
            key={template.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
          >
            <div className="aspect-[3/4] relative">
              <img
                src={template.artist_image_url}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              {!template.is_active && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-gray-400">Inactive</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-white font-medium">{template.name}</p>
              <p className="text-gray-500 text-sm">{template.artist?.name}</p>
              {template.song_title && (
                <p className="text-gray-600 text-xs mt-1">
                  ♪ {template.song_title}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {template.cards?.length || 0} cards
                </span>
                <a
                  href={`/admin/templates/${template.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        )) || (
          <div className="col-span-full py-12 text-center text-gray-500">
            No templates yet. Create your first template.
          </div>
        )}
      </div>
    </div>
  );
}
