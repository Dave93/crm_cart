import { create } from 'zustand';
import type { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  totalPrice: number;
  isUpdating: boolean;

  // Actions
  setCart: (items: CartItem[], totalPrice: number) => void;
  optimisticIncrement: (itemId: string) => void;
  optimisticDecrement: (itemId: string) => void;
  optimisticRemove: (itemId: string) => void;
  setUpdating: (isUpdating: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalPrice: 0,
  isUpdating: false,

  setCart: (items, totalPrice) => set({ items, totalPrice }),

  optimisticIncrement: (itemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.ID === itemId
          ? { ...item, UF_QUANTITY: item.UF_QUANTITY + 1 }
          : item
      ),
    })),

  optimisticDecrement: (itemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.ID === itemId && item.UF_QUANTITY > 1
          ? { ...item, UF_QUANTITY: item.UF_QUANTITY - 1 }
          : item
      ),
    })),

  optimisticRemove: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.ID !== itemId),
    })),

  setUpdating: (isUpdating) => set({ isUpdating }),
}));
