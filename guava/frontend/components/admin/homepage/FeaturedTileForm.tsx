"use client";

import { FeaturedTile } from "@/lib/types/cms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FeaturedTileFormProps {
  value: FeaturedTile;
  onChange: (value: FeaturedTile) => void;
}

export function FeaturedTileForm({ value, onChange }: FeaturedTileFormProps) {
  const update = (key: keyof FeaturedTile, val: any) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="featured-title">Title</Label>
        <Input
          id="featured-title"
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="featured-subtitle">Subtitle</Label>
          <Input
            id="featured-subtitle"
            value={value.subtitle || ""}
            onChange={(e) => update("subtitle", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="featured-badge">Badge</Label>
          <Input
            id="featured-badge"
            value={value.badge || ""}
            onChange={(e) => update("badge", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="featured-description">Bullet points (one per line)</Label>
        <Textarea
          id="featured-description"
          value={(value.description || []).join("\n")}
          onChange={(e) => update("description", e.target.value.split("\n"))}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="featured-price">Price</Label>
          <Input
            id="featured-price"
            type="number"
            value={value.price}
            onChange={(e) => update("price", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="featured-original-price">Original price</Label>
          <Input
            id="featured-original-price"
            type="number"
            value={value.originalPrice || ""}
            onChange={(e) => update("originalPrice", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="featured-saving">Saving</Label>
          <Input
            id="featured-saving"
            type="number"
            value={value.saving || ""}
            onChange={(e) => update("saving", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="featured-image">Image URL</Label>
          <Input
            id="featured-image"
            value={value.image}
            onChange={(e) => update("image", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="featured-cta-label">CTA Label</Label>
          <Input
            id="featured-cta-label"
            value={value.ctaLabel || ""}
            onChange={(e) => update("ctaLabel", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="featured-cta-href">CTA Link</Label>
        <Input
          id="featured-cta-href"
          value={value.ctaHref || ""}
          onChange={(e) => update("ctaHref", e.target.value)}
        />
      </div>
    </div>
  );
}

