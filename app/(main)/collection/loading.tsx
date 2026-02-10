import { Layers } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';

export default function Loading() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-800 bg-gray-900 p-6">
        <Layers className="text-blue-500" />
        <h1 className="text-2xl font-bold">Collection</h1>
        <span className="ml-auto text-sm text-gray-500">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-800" />
        </span>
      </div>

      {/* Skeleton List */}
      <div className="space-y-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4"
          >
            <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-full bg-gray-800" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-800" />
                <div className="h-4 w-8 animate-pulse rounded bg-gray-800" />
              </div>
              <div className="h-3 w-1/4 animate-pulse rounded bg-gray-800" />
            </div>
            <div className="h-5 w-5 animate-pulse rounded bg-gray-800" />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
