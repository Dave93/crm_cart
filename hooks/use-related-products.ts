'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRelatedProducts } from '@/lib/api/products';
import { useUrlParams } from './use-url-params';

export function useRelatedProducts() {
  const params = useUrlParams();

  return useQuery({
    queryKey: ['relatedProducts', params],
    queryFn: () => fetchRelatedProducts(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}
