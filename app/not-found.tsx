import Link from 'next/link';
import { Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <h1 className="mb-4 text-6xl font-bold text-gray-700">404</h1>
      <h2 className="mb-2 text-xl font-bold">ページが見つかりません</h2>
      <p className="mb-8 text-center text-gray-500">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href={ROUTES.HOME}
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-500"
      >
        <Home size={20} />
        ホームに戻る
      </Link>
    </div>
  );
}
