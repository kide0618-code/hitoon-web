import { Layers } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';

export default function Loading() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="p-6 bg-gray-900 border-b border-gray-800 flex items-center gap-3 sticky top-0 z-10">
        <Layers className="text-blue-500" />
        <h1 className="text-2xl font-bold">Collection</h1>
        <span className="text-gray-500 text-sm ml-auto">
          <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
        </span>
      </div>

      {/* Skeleton List */}
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 border border-gray-800"
          >
            <div className="w-16 h-16 rounded-full bg-gray-800 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-800 rounded w-1/3 animate-pulse" />
                <div className="h-4 w-8 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse" />
            </div>
            <div className="w-5 h-5 bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
