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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <AlertTriangle size={48} className="text-yellow-500 mb-4" />
      <h1 className="text-xl font-bold mb-2">エラーが発生しました</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        申し訳ありません。予期しないエラーが発生しました。
        もう一度お試しください。
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition-colors"
      >
        <RefreshCw size={20} />
        もう一度試す
      </button>
      {error.digest && (
        <p className="text-xs text-gray-600 mt-4">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
