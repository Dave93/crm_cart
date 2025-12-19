'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { UrlParams } from '@/types/api';

const DEFAULT_PROJECT = 'CHOPAR';

export function useUrlParams(): UrlParams {
  const searchParams = useSearchParams();

  return useMemo(
    () => ({
      dealId: searchParams.get('dealId'),
      project: searchParams.get('project') || DEFAULT_PROJECT,
      terminal: searchParams.get('terminal'),
      fuser: searchParams.get('fuser'),
    }),
    [searchParams]
  );
}
