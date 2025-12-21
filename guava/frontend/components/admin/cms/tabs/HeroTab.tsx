"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroSlide, HomepageCMSData } from "@/lib/types/cms";
import { Modal } from "@/components/admin/homepage/Modal";
import { HeroSlideForm } from "@/components/admin/homepage/HeroSlideForm";
import Image from "next/image";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export function HeroTab() {
  const [cmsData, setCmsData] = useState<HomepageCMSData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    slide: HeroSlide | null;
    slideId: string | null;
  }>({ open: false, slide: null, slideId: null });

  const openModal = (slide?: HeroSlide) => {
    if (slide) {
      setModalState({
        open: true,
        slide: { ...slide },
        slideId: slide.id,
      });
    } else {
      const newSlide: HeroSlide = {
        id: crypto.randomUUID(),
        title: "",
        eyebrow: "",
        description: "",
        ctaLabel: "",
        ctaHref: "",
        leftImage: "",
        rightImage: "",
        badge: "",
      };
      setModalState({
        open: true,
        slide: newSlide,
        slideId: null,
      });
    }
  };

  const closeModal = () => setModalState({ open: false, slide: null, slideId: null });

  const fetchHomepage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/homepage");
      const data = (await response.json()) as HomepageCMSData;
      setCmsData(data);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to fetch homepage CMS", error);
      setStatusMessage({ type: "error", text: "Failed to load hero slides" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepage();
  }, [fetchHomepage]);

  const saveSlide = () => {
    if (!modalState.slide || !cmsData) return;

    const updatedSlides = modalState.slideId
      ? cmsData.heroSlides.map((slide) =>
          slide.id === modalState.slideId ? modalState.slide! : slide
        )
      : [...cmsData.heroSlides, modalState.slide];

    setCmsData({ ...cmsData, heroSlides: updatedSlides });
    setIsDirty(true);
    closeModal();
  };

  const handleDeleteSlide = () => {
    if (!modalState.slideId || !cmsData) return;
    if (confirm("Are you sure you want to delete this hero slide? This action cannot be undone.")) {
      const updatedSlides = cmsData.heroSlides.filter((slide) => slide.id !== modalState.slideId);
      setCmsData({ ...cmsData, heroSlides: updatedSlides });
      setIsDirty(true);
      closeModal();
    }
  };

  const handleDelete = (slideId: string) => {
    if (!cmsData) return;
    if (confirm("Are you sure you want to delete this hero slide? This action cannot be undone.")) {
      const updatedSlides = cmsData.heroSlides.filter((slide) => slide.id !== slideId);
      setCmsData({ ...cmsData, heroSlides: updatedSlides });
      setIsDirty(true);
    }
  };

  const handleSaveAll = async () => {
    if (!cmsData) return;
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cmsData),
      });
      if (!response.ok) throw new Error("Request failed");
      setIsDirty(false);
      setStatusMessage({ type: "success", text: "Hero slides saved successfully! Changes will appear on frontend in a few seconds." });
    } catch (error) {
      console.error("Failed to save hero slides", error);
      setStatusMessage({ type: "error", text: "Failed to save hero slides" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !cmsData) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-48 rounded bg-gray-100 animate-pulse" />
        <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Hero Sections</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hero banners for homepage and category pages.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchHomepage} disabled={isLoading || isSaving} size="sm">
            Reset
          </Button>
          <Button
            className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]"
            onClick={handleSaveAll}
            disabled={!isDirty || isSaving}
            size="sm"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Preview
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`rounded-xl border px-4 py-2 text-sm ${
            statusMessage.type === "success"
              ? "border-emerald-200 text-emerald-800 bg-emerald-50"
              : "border-red-200 text-red-800 bg-red-50"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hero slides</h3>
            <p className="text-sm text-gray-500 mt-1">
              Carousel at the top of the homepage.
            </p>
          </div>
          <Button
            onClick={() => openModal()}
            variant="outline"
            size="sm"
          >
            Edit section
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cmsData.heroSlides.map((slide) => (
            <div
              key={slide.id}
              className="rounded-xl border border-gray-200 p-4 flex flex-col gap-3 bg-white hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {slide.leftImage || slide.rightImage ? (
                  <Image
                    src={slide.leftImage || slide.rightImage || ""}
                    alt={slide.title || "Hero slide"}
                    fill
                    className="object-cover"
                    unoptimized={slide.leftImage?.startsWith("data:") || slide.rightImage?.startsWith("data:")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                {slide.eyebrow && (
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{slide.eyebrow}</p>
                )}
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {slide.title || "Untitled slide"}
                </p>
                {slide.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{slide.description}</p>
                )}
                {slide.ctaLabel && (
                  <p className="text-xs text-gray-400 mt-2">
                    CTA: {slide.ctaLabel} → {slide.ctaHref || "—"}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-gray-600 hover:text-gray-900"
                  onClick={() => openModal(slide)}
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Manage item
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(slide.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <button
            className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:border-[#A7E059] hover:text-[#A7E059] transition-colors flex flex-col items-center justify-center min-h-[200px]"
            onClick={() => openModal()}
          >
            <span className="text-2xl mb-2">+</span>
            <span>Add new item</span>
          </button>
        </div>
      </div>

      <Modal
        open={modalState.open}
        onClose={closeModal}
        title={modalState.slideId ? "Edit section item" : "Add section item"}
        description="Update content and links for this section."
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {modalState.slideId && (
                <Button
                  variant="outline"
                  onClick={handleDeleteSlide}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]" onClick={saveSlide}>
                Save changes
              </Button>
            </div>
          </div>
        }
      >
        {modalState.slide && (
          <HeroSlideForm
            value={modalState.slide}
            onChange={(val) => setModalState((prev) => ({ ...prev, slide: val }))}
          />
        )}
      </Modal>
    </div>
  );
}
