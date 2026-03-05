import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  // Check if user is an operator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: operator } = (await (supabase.from('operators') as any)
    .select('role')
    .eq('user_id', user.id)
    .single()) as { data: { role: string } | null };

  if (!operator) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-white">
              HITOON Admin
            </Link>
            <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
              {operator.role}
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-gray-400 transition-colors hover:text-white">
              Dashboard
            </Link>
            <Link
              href="/admin/artists"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Artists
            </Link>
            <Link href="/admin/cards" className="text-gray-400 transition-colors hover:text-white">
              Cards
            </Link>
            <Link
              href="/admin/purchases"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Purchases
            </Link>
            <Link href="/" className="text-sm text-gray-500 transition-colors hover:text-gray-300">
              ← Back to Site
            </Link>
          </nav>
        </div>
      </header>

      {/* Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
