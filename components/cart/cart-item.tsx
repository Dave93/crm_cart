'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';
import { useCartMutations } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils/currency';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { increaseItem, decreaseItem, deleteItem } = useCartMutations();

  const handleIncrease = () => increaseItem.mutate(item.ID);
  const handleDecrease = () => decreaseItem.mutate(item.ID);
  const handleDelete = () => deleteItem.mutate(item.ID);

  const lineTotal = item.UF_PRICE * item.UF_QUANTITY;
  const hasModifiers = item.UF_MOFIDIERS && item.UF_MOFIDIERS.length > 0;

  return (
    <div className="px-3 py-2 flex items-center gap-3 hover:bg-muted/30 transition-colors group">
      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <div className="font-medium text-sm truncate">{item.UF_PRODUCT_NAME}</div>
        {hasModifiers && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {item.UF_MOFIDIERS!.map((mod) => (
              <span key={mod.ID} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {mod.NAME}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Unit Price */}
      <div className="w-24 text-right text-sm font-semibold text-muted-foreground price-tag">
        {formatCurrency(item.UF_PRICE)}
      </div>

      {/* Quantity Controls */}
      <div className="qty-stepper">
        <button onClick={handleDecrease} disabled={decreaseItem.isPending || item.UF_QUANTITY <= 1}>
          <Minus className="w-3 h-3" />
        </button>
        <span className="qty-value">{item.UF_QUANTITY}</span>
        <button onClick={handleIncrease} disabled={increaseItem.isPending}>
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Line Total */}
      <div className="w-28 text-right font-bold text-base price-tag">
        {formatCurrency(lineTotal)}
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        disabled={deleteItem.isPending}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
