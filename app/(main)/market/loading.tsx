import { PageContainer } from '@/components/layout/page-container';

export default function Loading() {
  return (
    <PageContainer>
      <div className="p-4">
        <div className="mb-6 h-8 w-1/3 animate-pulse rounded bg-gray-800" />

        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-3"
            >
              <div className="h-20 w-20 flex-shrink-0 animate-pulse rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-800" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-800" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
