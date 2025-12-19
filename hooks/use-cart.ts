'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUrlParams } from './use-url-params';
import { useCartStore } from '@/stores/cart-store';
import * as cartApi from '@/lib/api/cart';
import type { AddToCartPayload } from '@/types/cart';
import { useEffect } from 'react';

export function useCart() {
  const params = useUrlParams();
  const setCart = useCartStore((s) => s.setCart);

  const query = useQuery({
    queryKey: ['cart', params],
    queryFn: () => cartApi.fetchCart(params),
    staleTime: 0, // Always fresh
  });

  // Sync to Zustand store
  useEffect(() => {
    if (query.data) {
      setCart(query.data.items, query.data.totalPrice);
    }
  }, [query.data, setCart]);

  return query;
}

export function useCartMutations() {
  const queryClient = useQueryClient();
  const params = useUrlParams();
  const { optimisticIncrement, optimisticDecrement, optimisticRemove } =
    useCartStore();

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['relatedProducts'] });
  };

  const addToCart = useMutation({
    mutationFn: (payload: Omit<AddToCartPayload, 'dealId' | 'project' | 'fuser'>) =>
      cartApi.addToCart({
        ...payload,
        dealId: params.dealId || undefined,
        project: params.project,
        fuser: params.fuser || undefined,
      }),
    onSuccess: invalidateCart,
  });

  const increaseItem = useMutation({
    mutationFn: (rowId: string) => {
      optimisticIncrement(rowId);
      return cartApi.increaseCartItem(rowId, params.project);
    },
    onSuccess: invalidateCart,
  });

  const decreaseItem = useMutation({
    mutationFn: (rowId: string) => {
      optimisticDecrement(rowId);
      return cartApi.decreaseCartItem(rowId, params.project);
    },
    onSuccess: invalidateCart,
  });

  const deleteItem = useMutation({
    mutationFn: (rowId: string) => {
      optimisticRemove(rowId);
      return cartApi.deleteCartItem(rowId, params.project);
    },
    onSuccess: invalidateCart,
  });

  return { addToCart, increaseItem, decreaseItem, deleteItem };
}
