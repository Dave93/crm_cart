'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useProducts, useFilteredProducts } from '@/hooks/use-products';
import { ProductItem } from './product-item';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

export function ProductList() {
  const parentRef = useRef<HTMLDivElement>(null);
  const { data: products, isLoading, error } = useProducts();
  const filteredProducts = useFilteredProducts(products);

  const virtualizer = useVirtualizer({
    count: filteredProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 8,
  });

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white p-2 space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border bg-white p-4 text-center">
        <p className="text-sm text-destructive">Ошибка загрузки</p>
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div className="rounded-md border border-dashed bg-muted/30 py-8 text-center">
        <Search className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1" />
        <p className="text-sm text-muted-foreground">Выберите категорию или введите запрос</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div ref={parentRef} className="h-[520px] overflow-auto custom-scrollbar">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ProductItem product={filteredProducts[virtualRow.index]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
