'use client';

import { useCategories } from '@/hooks/use-categories';
import { useUIStore } from '@/stores/ui-store';
import { Skeleton } from '@/components/ui/skeleton';
import type { CategoryNode } from '@/types/category';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  node: CategoryNode;
  level: number;
}

function TreeNode({ node, level }: TreeNodeProps) {
  const expandedCategoryIds = useUIStore((s) => s.expandedCategoryIds);
  const selectedCategoryIds = useUIStore((s) => s.selectedCategoryIds);
  const setSelectedCategories = useUIStore((s) => s.setSelectedCategories);
  const setExpandedCategories = useUIStore((s) => s.setExpandedCategories);

  const isExpanded = expandedCategoryIds.includes(Number(node.ID));
  const isSelected = selectedCategoryIds.includes(Number(node.ID));
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      if (isExpanded) {
        setExpandedCategories(expandedCategoryIds.filter((id) => id !== Number(node.ID)));
      } else {
        setExpandedCategories([...expandedCategoryIds, Number(node.ID)]);
      }
    }
  };

  const handleSelect = () => {
    if (isSelected) {
      // Клик на уже выбранную — снять выбор
      setSelectedCategories([]);
    } else {
      // Выбрать только эту категорию
      setSelectedCategories([Number(node.ID)]);
    }
  };

  return (
    <div>
      <div
        className={cn('tree-item flex items-center gap-1', isSelected && 'selected')}
        style={{ paddingLeft: `${level * 10 + 4}px` }}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <button onClick={handleToggle} className="p-0.5 -ml-0.5 rounded hover:bg-black/5">
            <ChevronRight className={cn('w-3 h-3 text-muted-foreground transition-transform', isExpanded && 'rotate-90')} />
          </button>
        ) : (
          <span className="w-3" />
        )}
        <span className="truncate">{node.NAME}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.ID} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white p-2 space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-6" style={{ width: `${60 + Math.random() * 40}%` }} />
        ))}
      </div>
    );
  }

  if (error || !data?.items?.length) {
    return (
      <div className="rounded-md border bg-white p-3 text-center">
        <p className="text-xs text-muted-foreground">Категории не найдены</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="p-1 max-h-[500px] overflow-y-auto custom-scrollbar">
        {data.items.map((node) => (
          <TreeNode key={node.ID} node={node} level={0} />
        ))}
      </div>
    </div>
  );
}
