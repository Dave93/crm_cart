'use client';

import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingFallback() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-8 w-full" />
      <div className="grid grid-cols-12 gap-3">
        <Skeleton className="col-span-3 h-64" />
        <Skeleton className="col-span-9 h-64" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="p-3 bg-background min-h-screen">
      <Suspense fallback={<LoadingFallback />}>
        <MainLayout />
      </Suspense>
    </main>
  );
}
