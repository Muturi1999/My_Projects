"use client";

import { ProductHighlight } from "@/lib/types/cms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductHighlightFormProps {
  value: ProductHighlight;
  onChange: (value: ProductHighlight) => void;
}

export function ProductHighlightForm({ value, onChange }: ProductHighlightFormProps) {
  const update = (key: keyof ProductHighlight, val: any) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="product-name">Name</Label>
        <Input
          id="product-name"
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="product-slug">Link / slug</Label>
        <Input
          id="product-slug"
          value={value.slug}
          onChange={(e) => update("slug", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="product-image">Image URL</Label>
        <Input
          id="product-image"
          value={value.image}
          onChange={(e) => update("image", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="product-price">Price</Label>
          <Input
            id="product-price"
            type="number"
            value={value.price}
            onChange={(e) => update("price", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="product-original-price">Original price</Label>
          <Input
            id="product-original-price"
            type="number"
            value={value.originalPrice || ""}
            onChange={(e) => update("originalPrice", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="product-badge">Badge text</Label>
          <Input
            id="product-badge"
            value={value.badge || ""}
            onChange={(e) => update("badge", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="product-stock">Stock status</Label>
          <Input
            id="product-stock"
            placeholder="true / false"
            value={value.inStock ? "true" : "false"}
            onChange={(e) => update("inStock", e.target.value === "true")}
          />
        </div>
      </div>
    </div>
  );
}

