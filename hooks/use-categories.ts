'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCategories } from '@/lib/api/categories';
import { useUrlParams } from './use-url-params';
import { useUIStore } from '@/stores/ui-store';

export function useCategories() {
  const params = useUrlParams();
  const setExpandedCategories = useUIStore((s) => s.setExpandedCategories);

  const query = useQuery({
    queryKey: ['categories', params],
    queryFn: () => fetchCategories(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Set expanded keys when data loads
  useEffect(() => {
    if (query.data?.ids) {
      setExpandedCategories(query.data.ids);
    }
  }, [query.data?.ids, setExpandedCategories]);

  return query;
}
