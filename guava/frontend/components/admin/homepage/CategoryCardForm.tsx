"use client";

import { CategoryCardContent } from "@/lib/types/cms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryCardFormProps {
  value: CategoryCardContent;
  onChange: (value: CategoryCardContent) => void;
}

export function CategoryCardForm({ value, onChange }: CategoryCardFormProps) {
  const update = (key: keyof CategoryCardContent, val: string | undefined) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="category-title">Title</Label>
        <Input
          id="category-title"
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category-slug">Slug / URL</Label>
        <Input
          id="category-slug"
          value={value.slug}
          onChange={(e) => update("slug", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category-image">Image URL</Label>
        <Input
          id="category-image"
          value={value.image}
          onChange={(e) => update("image", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category-variant">Variant (default / highlight)</Label>
        <Input
          id="category-variant"
          value={value.variant || ""}
          placeholder="default"
          onChange={(e) => update("variant", e.target.value as CategoryCardContent["variant"])}
        />
      </div>
    </div>
  );
}

