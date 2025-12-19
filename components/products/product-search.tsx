'use client';

import { useUIStore } from '@/stores/ui-store';
import { Search, X } from 'lucide-react';

export function ProductSearch() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  return (
    <div className="search-input">
      <Search className="search-icon w-4 h-4" />
      <input
        type="text"
        placeholder="Поиск товара..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
