import { PageContainer } from '@/components/layout/page-container';

export default function Loading() {
  return (
    <PageContainer>
      <div className="p-4">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-6 animate-pulse" />

        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-xl border border-gray-800 p-3 flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-gray-800 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-800 rounded w-2/3 animate-pulse" />
                <div className="h-3 bg-gray-800 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
