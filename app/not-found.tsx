import Link from 'next/link';
import { Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <h2 className="text-xl font-bold mb-2">ページが見つかりません</h2>
      <p className="text-gray-500 mb-8 text-center">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href={ROUTES.HOME}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition-colors"
      >
        <Home size={20} />
        ホームに戻る
      </Link>
    </div>
  );
}
