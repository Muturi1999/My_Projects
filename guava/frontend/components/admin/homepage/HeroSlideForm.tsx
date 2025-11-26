"use client";

import { useState } from "react";
import { HeroSlide } from "@/lib/types/cms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HeroSlideFormProps {
  value: HeroSlide;
  onChange: (value: HeroSlide) => void;
}

export function HeroSlideForm({ value, onChange }: HeroSlideFormProps) {
  const [localValue, setLocalValue] = useState(value);

  const updateField = (key: keyof HeroSlide, val: string | undefined) => {
    const updated = { ...localValue, [key]: val };
    setLocalValue(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            value={localValue.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero-eyebrow">Eyebrow (optional)</Label>
          <Input
            id="hero-eyebrow"
            value={localValue.eyebrow || ""}
            onChange={(e) => updateField("eyebrow", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-description">Description</Label>
        <Textarea
          id="hero-description"
          value={localValue.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hero-cta-label">CTA Label</Label>
          <Input
            id="hero-cta-label"
            value={localValue.ctaLabel || ""}
            onChange={(e) => updateField("ctaLabel", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero-cta-href">CTA Link</Label>
          <Input
            id="hero-cta-href"
            value={localValue.ctaHref || ""}
            onChange={(e) => updateField("ctaHref", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hero-left-image">Left image URL</Label>
          <Input
            id="hero-left-image"
            value={localValue.leftImage || ""}
            onChange={(e) => updateField("leftImage", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero-right-image">Right image URL</Label>
          <Input
            id="hero-right-image"
            value={localValue.rightImage || ""}
            onChange={(e) => updateField("rightImage", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

