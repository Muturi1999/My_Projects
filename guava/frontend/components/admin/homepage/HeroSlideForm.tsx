"use client";

import { useState, useRef } from "react";
import { HeroSlide } from "@/lib/types/cms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

interface HeroSlideFormProps {
  value: HeroSlide;
  onChange: (value: HeroSlide) => void;
}

export function HeroSlideForm({ value, onChange }: HeroSlideFormProps) {
  const [localValue, setLocalValue] = useState(value);
  const leftImageInputRef = useRef<HTMLInputElement>(null);
  const rightImageInputRef = useRef<HTMLInputElement>(null);

  const updateField = (key: keyof HeroSlide, val: string | undefined) => {
    const updated = { ...localValue, [key]: val };
    setLocalValue(updated);
    onChange(updated);
  };

  const handleImageUpload = (
    file: File,
    imageType: "leftImage" | "rightImage"
  ) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateField(imageType, dataUrl);
    };
    reader.onerror = () => {
      alert("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "leftImage" | "rightImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, imageType);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDeleteImage = (imageType: "leftImage" | "rightImage") => {
    if (confirm("Are you sure you want to delete this image?")) {
      updateField(imageType, "");
    }
  };

  const ImageUploadField = ({
    label,
    imageType,
    imageValue,
    inputRef,
  }: {
    label: string;
    imageType: "leftImage" | "rightImage";
    imageValue: string | undefined;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => {
    const isDataUrl = imageValue?.startsWith("data:");
    const isUrl = imageValue?.startsWith("http://") || imageValue?.startsWith("https://");
    const isLocalPath = imageValue?.startsWith("/");

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="space-y-2">
          {/* Image Preview */}
          {imageValue && (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {isDataUrl || isUrl || isLocalPath ? (
                <Image
                  src={imageValue}
                  alt={label}
                  fill
                  className="object-contain"
                  unoptimized={isDataUrl || isUrl}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Invalid image
                </div>
              )}
              <button
                type="button"
                onClick={() => handleDeleteImage(imageType)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                aria-label="Delete image"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Upload Controls */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileInputChange(e, imageType)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="flex-1"
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              {imageValue ? "Re-upload Image" : "Upload from Device"}
            </Button>
            {imageValue && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDeleteImage(imageType)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* URL Input (Alternative) */}
          <div className="space-y-1">
            <Label htmlFor={`${imageType}-url`} className="text-xs text-gray-500">
              Or paste image URL
            </Label>
            <Input
              id={`${imageType}-url`}
              type="url"
              value={imageValue || ""}
              onChange={(e) => updateField(imageType, e.target.value)}
              placeholder="https://example.com/image.png or /image.png"
            />
          </div>
        </div>
      </div>
    );
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
            placeholder="Enter slide title"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero-eyebrow">Eyebrow (optional)</Label>
          <Input
            id="hero-eyebrow"
            value={localValue.eyebrow || ""}
            onChange={(e) => updateField("eyebrow", e.target.value)}
            placeholder="Small text above title"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-description">Description</Label>
        <Textarea
          id="hero-description"
          value={localValue.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Enter slide description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hero-cta-label">CTA Label</Label>
          <Input
            id="hero-cta-label"
            value={localValue.ctaLabel || ""}
            onChange={(e) => updateField("ctaLabel", e.target.value)}
            placeholder="e.g., Shop Now"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero-cta-href">CTA Link</Label>
          <Input
            id="hero-cta-href"
            value={localValue.ctaHref || ""}
            onChange={(e) => updateField("ctaHref", e.target.value)}
            placeholder="e.g., /products or https://..."
          />
        </div>
      </div>

      {/* Image Upload Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <ImageUploadField
          label="Left image URL"
          imageType="leftImage"
          imageValue={localValue.leftImage}
          inputRef={leftImageInputRef}
        />
        <ImageUploadField
          label="Right image URL"
          imageType="rightImage"
          imageValue={localValue.rightImage}
          inputRef={rightImageInputRef}
        />
      </div>
    </div>
  );
}
