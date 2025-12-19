'use client';

import { formatCurrency } from '@/lib/utils/currency';

interface CartSummaryProps {
  totalPrice: number;
  itemCount: number;
}

export function CartSummary({ totalPrice }: CartSummaryProps) {
  return (
    <div className="px-3 py-2 bg-muted/30 border-t flex items-center justify-end gap-3">
      <span className="text-sm text-muted-foreground">Итого:</span>
      <span className="price-tag text-xl font-bold text-primary">
        {formatCurrency(totalPrice)}
      </span>
    </div>
  );
}
