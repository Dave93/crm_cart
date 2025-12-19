import { create } from 'zustand';

interface UIState {
  searchQuery: string;
  selectedCategoryIds: number[];
  expandedCategoryIds: number[];

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategories: (ids: number[]) => void;
  setExpandedCategories: (ids: number[]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: '',
  selectedCategoryIds: [],
  expandedCategoryIds: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategories: (ids) => set({ selectedCategoryIds: ids }),
  setExpandedCategories: (ids) => set({ expandedCategoryIds: ids }),
}));
