'use client';

import { useRelatedProducts } from '@/hooks/use-related-products';
import { useCartMutations } from '@/hooks/use-cart';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function RelatedProducts() {
  const { data: products, isLoading } = useRelatedProducts();
  const { addToCart } = useCartMutations();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAdd = async (productId: string) => {
    setAddingId(productId);
    try {
      await addToCart.mutateAsync({
        productId,
        additional: true,
      });
    } finally {
      setAddingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-md" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="rounded-md border border-dashed bg-muted/30 py-3 text-center">
        <p className="text-xs text-muted-foreground">Нет рекомендаций</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {products.map((item) => {
        const isAdding = addingId === item.PRODUCT_ID;
        return (
          <button
            key={item.PRODUCT_ID}
            onClick={() => handleAdd(item.PRODUCT_ID)}
            disabled={isAdding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <span className="truncate max-w-[120px]">{item.NAME}</span>
            <Plus className={`w-3 h-3 flex-shrink-0 ${isAdding ? 'animate-spin' : ''}`} />
          </button>
        );
      })}
    </div>
  );
}
