"use client";

import { CategoryTaxonomy } from "@/lib/types/taxonomy";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CategoryTaxonomyFormProps {
  value: CategoryTaxonomy;
  onChange: (value: CategoryTaxonomy) => void;
  parentOptions: CategoryTaxonomy[];
}

export function CategoryTaxonomyForm({ value, onChange, parentOptions }: CategoryTaxonomyFormProps) {
  const update = (key: keyof CategoryTaxonomy, val: any) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="tax-title">Category title</Label>
        <Input
          id="tax-title"
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-slug">Slug / URL</Label>
        <Input
          id="tax-slug"
          value={value.slug}
          onChange={(e) => update("slug", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-parent">Parent category (optional)</Label>
        <select
          id="tax-parent"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={value.parentId || ""}
          onChange={(e) => update("parentId", e.target.value || null)}
        >
          <option value="">No parent</option>
          {parentOptions
            .filter((cat) => cat.id !== value.id)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-description">Description</Label>
        <Textarea
          id="tax-description"
          value={value.description || ""}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-hero-headline">Hero headline</Label>
        <Input
          id="tax-hero-headline"
          value={value.heroHeadline || ""}
          onChange={(e) => update("heroHeadline", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-hero-description">Hero description</Label>
        <Textarea
          id="tax-hero-description"
          value={value.heroDescription || ""}
          onChange={(e) => update("heroDescription", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-meta-title">Meta title</Label>
        <Input
          id="tax-meta-title"
          value={value.metaTitle || ""}
          onChange={(e) => update("metaTitle", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-meta-description">Meta description</Label>
        <Textarea
          id="tax-meta-description"
          value={value.metaDescription || ""}
          onChange={(e) => update("metaDescription", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tax-tags">Tags (comma-separated)</Label>
        <Input
          id="tax-tags"
          value={(value.tags || []).join(", ")}
          onChange={(e) =>
            update(
              "tags",
              e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
    </div>
  );
}

