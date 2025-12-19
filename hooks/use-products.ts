'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchProducts } from '@/lib/api/products';
import { useUrlParams } from './use-url-params';
import { useUIStore } from '@/stores/ui-store';
import type { Product } from '@/types/product';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ru = require('convert-layout/ru');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const translit = require('latin-to-cyrillic');

export function useProducts() {
  const params = useUrlParams();

  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFilteredProducts(products: Product[] = []) {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const selectedCategoryIds = useUIStore((s) => s.selectedCategoryIds);

  return useMemo(() => {
    if (!products.length) return [];

    const lowerSearch = searchQuery.toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        searchQuery.length > 0 &&
        (product.NAME.toLowerCase().includes(lowerSearch) ||
          product.NAME.toLowerCase().includes(translit(lowerSearch)) ||
          product.NAME.toLowerCase().includes(ru.fromEn(lowerSearch)));

      const matchesCategory =
        selectedCategoryIds.length > 0 &&
        selectedCategoryIds.includes(Number(product.IBLOCK_SECTION_ID));

      return matchesSearch || matchesCategory;
    });
  }, [products, searchQuery, selectedCategoryIds]);
}
