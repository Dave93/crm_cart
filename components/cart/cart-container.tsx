'use client';

import { useCart } from '@/hooks/use-cart';
import { useCartStore } from '@/stores/cart-store';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';

export function CartContainer() {
  const { isLoading, error } = useCart();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white p-2 space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-center">
        <p className="text-destructive text-sm">Ошибка загрузки корзины</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-md border border-dashed bg-muted/30 py-4 text-center">
        <ShoppingBag className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1" />
        <p className="text-sm text-muted-foreground">Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="divide-y divide-border">
        {items.map((item) => (
          <CartItem key={item.ID} item={item} />
        ))}
      </div>
      <CartSummary totalPrice={totalPrice} itemCount={items.length} />
    </div>
  );
}
