"use client";

import { Button } from "@/components/ui/button";

interface SectionCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onEdit?: () => void;
  onReorder?: () => void;
}

export function SectionCard({ title, description, children, onEdit, onReorder }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {onReorder && (
            <Button variant="outline" size="sm" onClick={onReorder}>
              Reorder
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              Edit section
            </Button>
          )}
        </div>
      </div>
      {children && <div className="p-4">{children}</div>}
    </div>
  );
}

