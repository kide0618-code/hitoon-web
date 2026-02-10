'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <AlertTriangle size={48} className="mb-4 text-yellow-500" />
      <h1 className="mb-2 text-xl font-bold">エラーが発生しました</h1>
      <p className="mb-8 max-w-md text-center text-gray-500">
        申し訳ありません。予期しないエラーが発生しました。 もう一度お試しください。
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-500"
      >
        <RefreshCw size={20} />
        もう一度試す
      </button>
      {error.digest && <p className="mt-4 text-xs text-gray-600">Error ID: {error.digest}</p>}
    </div>
  );
}
