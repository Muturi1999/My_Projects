"use client";

import { SectionBlock } from "@/lib/types/cms";
import { SectionCard } from "./SectionCard";
import { Button } from "@/components/ui/button";

interface SectionListProps<T> {
  block: SectionBlock<T>;
  renderItem: (item: T) => React.ReactNode;
  onAddItem?: () => void;
  onEditItem?: (item: T) => void;
  onReorder?: () => void;
}

export function SectionList<T>({
  block,
  renderItem,
  onAddItem,
  onEditItem,
  onReorder,
}: SectionListProps<T>) {
  return (
    <SectionCard
      title={block.title}
      description={block.description}
      onEdit={onEditItem ? () => onEditItem(block.items[0]) : undefined}
      onReorder={onReorder}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {block.items.map((item, index) => (
          <div key={(item as any).id || index} className="rounded-xl border border-gray-100 p-4 flex flex-col gap-2 bg-[#F9FAFB]">
            {renderItem(item)}
            {onEditItem && (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-500 hover:text-gray-900 px-0"
                onClick={() => onEditItem(item)}
              >
                Manage item
              </Button>
            )}
          </div>
        ))}
        {onAddItem && (
          <button
            className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:border-[#A7E059] hover:text-[#A7E059] transition-colors"
            onClick={onAddItem}
          >
            + Add new item
          </button>
        )}
      </div>
    </SectionCard>
  );
}

