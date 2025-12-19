'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useCartMutations } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils/currency';
import type { Product, ProductModifier } from '@/types/product';
import { Loader2, ChevronDown, Check, ShoppingCart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
  const { addToCart } = useCartMutations();
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const modifiers = useMemo(() => {
    return product.modifiers?.filter((m): m is ProductModifier => m !== null) ?? [];
  }, [product.modifiers]);

  const defaultModifiers = useMemo(() => {
    const freeModifier = modifiers.find((m) => m.PRICE === 0);
    return freeModifier ? [freeModifier.PRODUCT_ID] : [];
  }, [modifiers]);

  const [selectedModifiers, setSelectedModifiers] = useState<string[]>(defaultModifiers);

  const handleAddToCart = async (additional = false) => {
    setIsAdding(true);
    try {
      await addToCart.mutateAsync({
        productId: product.PRODUCT_ID,
        modifiers: selectedModifiers.length > 0 ? selectedModifiers : undefined,
        additional,
      });
      setIsExpanded(false);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleModifier = (modifierId: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(modifierId) ? prev.filter((id) => id !== modifierId) : [...prev, modifierId]
    );
  };

  const hasModifiers = modifiers.length > 0;
  const isUnavailable = !product.AVAILABLE;

  return (
    <div className={cn('relative', isUnavailable && 'opacity-50')}>
      <div className={cn(
        'px-3 py-2 flex items-center gap-3 border-b border-transparent',
        !isUnavailable && 'hover:bg-muted/30',
        isExpanded && 'bg-muted/30'
      )}>
        <div className="flex-grow min-w-0">
          <span className="text-sm truncate block">
            {product.NAME}
            {isUnavailable && <span className="text-xs text-destructive ml-2">(стоп)</span>}
          </span>
        </div>

        <div className="w-24 text-right text-sm font-bold price-tag">{formatCurrency(product.PRICE)}</div>

        <Button
          onClick={() => handleAddToCart(true)}
          disabled={isAdding || isUnavailable}
          className="btn-add-cart w-20 bg-emerald-500 hover:bg-emerald-600"
        >
          {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Zap className="w-3 h-3 mr-1" />Доп.</>}
        </Button>

        {hasModifiers ? (
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isUnavailable}
            className={cn('btn-modifier w-28', isExpanded && 'border-primary bg-primary/5')}
          >
            Модиф.
            <ChevronDown className={cn('w-3 h-3 ml-1 transition-transform', isExpanded && 'rotate-180')} />
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToCart(false)}
            disabled={isAdding || isUnavailable}
            className="btn-add-cart w-28"
          >
            {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ShoppingCart className="w-3 h-3 mr-1" />В корзину</>}
          </Button>
        )}
      </div>

      {isExpanded && hasModifiers && (
        <div className="px-3 py-2 bg-muted/20 border-b flex flex-wrap items-center gap-2">
          {modifiers.map((mod) => {
            const isSelected = selectedModifiers.includes(mod.PRODUCT_ID);
            return (
              <button
                key={mod.ID}
                onClick={() => toggleModifier(mod.PRODUCT_ID)}
                className={cn('badge-modifier', isSelected && 'selected')}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {mod.NAME}
                {mod.PRICE > 0 && <span className="opacity-70">+{formatCurrency(mod.PRICE)}</span>}
              </button>
            );
          })}
          <Button onClick={() => handleAddToCart(false)} disabled={isAdding} className="btn-add-cart ml-auto">
            {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Добавить'}
          </Button>
        </div>
      )}
    </div>
  );
}
