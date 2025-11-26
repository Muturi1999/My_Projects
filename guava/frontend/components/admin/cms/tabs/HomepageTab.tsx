"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionList } from "@/components/admin/homepage/SectionList";
import {
  HeroSlide,
  CategoryCardContent,
  FeaturedTile,
  ProductHighlight,
  HomepageCMSData,
} from "@/lib/types/cms";
import { Modal } from "@/components/admin/homepage/Modal";
import { HeroSlideForm } from "@/components/admin/homepage/HeroSlideForm";
import { Button } from "@/components/ui/button";
import { CategoryCardForm } from "@/components/admin/homepage/CategoryCardForm";
import { FeaturedTileForm } from "@/components/admin/homepage/FeaturedTileForm";
import { ProductHighlightForm } from "@/components/admin/homepage/ProductHighlightForm";
import Link from "next/link";

type SectionKey =
  | "heroSlides"
  | "shopByCategory"
  | "featuredDeals"
  | "hotDeals"
  | "printerScanner"
  | "accessories"
  | "audio"
  | "popularBrands"
  | "popularCategories";

type DraftType = HeroSlide | CategoryCardContent | FeaturedTile | ProductHighlight;

export function HomepageTab() {
  const [cmsData, setCmsData] = useState<HomepageCMSData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    section: SectionKey | null;
    draft: DraftType | null;
    itemId: string | null;
  }>({ open: false, section: null, draft: null, itemId: null });

  const createDefaultDraft = (section: SectionKey): DraftType => {
    const id = crypto.randomUUID();
    switch (section) {
      case "heroSlides":
        return { id, title: "", ctaHref: "", ctaLabel: "" };
      case "shopByCategory":
      case "popularBrands":
      case "popularCategories":
        return { id, title: "", slug: "", image: "" };
      case "featuredDeals":
        return { id, title: "", description: [], price: 0, image: "", ctaHref: "" };
      default:
        return { id, name: "", slug: "", image: "", price: 0 };
    }
  };

  const openModal = (section: SectionKey, item?: DraftType) => {
    setModalState({
      open: true,
      section,
      draft: item ? { ...item } : createDefaultDraft(section),
      itemId: item ? (item as any).id : null,
    });
  };

  const closeModal = () => setModalState({ open: false, section: null, draft: null, itemId: null });

  const applySectionUpdate = useCallback((updater: (prev: HomepageCMSData) => HomepageCMSData) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      setIsDirty(true);
      return updater(prev);
    });
  }, []);

  const fetchHomepage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/homepage");
      const data = (await response.json()) as HomepageCMSData;
      setCmsData(data);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to fetch homepage CMS", error);
      setStatusMessage({ type: "error", text: "Failed to load homepage data" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepage();
  }, [fetchHomepage]);

  const saveDraft = () => {
    if (!modalState.section || !modalState.draft || !cmsData) return;
    const section = modalState.section;
    const draft = modalState.draft;

    applySectionUpdate((prev) => {
      if (section === "heroSlides") {
        const slides = prev.heroSlides || [];
        const updatedSlides = modalState.itemId
          ? slides.map((slide) => (slide.id === modalState.itemId ? (draft as HeroSlide) : slide))
          : [...slides, draft as HeroSlide];
        return { ...prev, heroSlides: updatedSlides };
      }

      const block = prev[section];
      if (!block) return prev;

      const updatedItems = modalState.itemId
        ? block.items.map((item) => ((item as any).id === modalState.itemId ? draft : item))
        : [...block.items, draft as any];

      return {
        ...prev,
        [section]: { ...block, items: updatedItems },
      };
    });

    closeModal();
  };

  const renderForm = () => {
    if (!modalState.section || !modalState.draft) return null;
    switch (modalState.section) {
      case "heroSlides":
        return (
          <HeroSlideForm
            value={modalState.draft as HeroSlide}
            onChange={(val) => setModalState((prev) => ({ ...prev, draft: val }))}
          />
        );
      case "shopByCategory":
      case "popularBrands":
      case "popularCategories":
        return (
          <CategoryCardForm
            value={modalState.draft as CategoryCardContent}
            onChange={(val) => setModalState((prev) => ({ ...prev, draft: val }))}
          />
        );
      case "featuredDeals":
        return (
          <FeaturedTileForm
            value={modalState.draft as FeaturedTile}
            onChange={(val) => setModalState((prev) => ({ ...prev, draft: val }))}
          />
        );
      default:
        return (
          <ProductHighlightForm
            value={modalState.draft as ProductHighlight}
            onChange={(val) => setModalState((prev) => ({ ...prev, draft: val }))}
          />
        );
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
      setStatusMessage({ type: "success", text: "Homepage saved successfully" });
    } catch (error) {
      console.error("Failed to save homepage", error);
      setStatusMessage({ type: "error", text: "Failed to save homepage changes" });
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
          <h2 className="text-xl font-semibold text-gray-900">Homepage Content</h2>
          <p className="text-sm text-gray-500 mt-1">Control hero, category highlights, deals, and promotional sections.</p>
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
            href="/api/admin/homepage/preview"
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

      <SectionList
        block={cmsData.heroSlides && {
          id: "hero",
          title: "Hero slides",
          description: "Carousel at the top of the homepage.",
          items: cmsData.heroSlides,
        }}
        renderItem={(slide) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{slide.title}</p>
            <p className="text-xs text-gray-500">{slide.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              CTA: {slide.ctaLabel || "—"} → {slide.ctaHref || "—"}
            </p>
          </div>
        )}
        onEditItem={(item) => openModal("heroSlides", item as HeroSlide)}
        onAddItem={() => openModal("heroSlides")}
      />

      <SectionList
        block={cmsData.shopByCategory}
        renderItem={(category) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{category.title}</p>
            <p className="text-xs text-gray-500">{category.slug}</p>
          </div>
        )}
        onEditItem={(item) => openModal("shopByCategory", item as CategoryCardContent)}
        onAddItem={() => openModal("shopByCategory")}
      />

      <SectionList
        block={cmsData.featuredDeals}
        renderItem={(deal) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{deal.title}</p>
            <p className="text-xs text-gray-500">{deal.subtitle}</p>
            <p className="text-xs text-gray-400">Price: KSh {deal.price.toLocaleString()}</p>
          </div>
        )}
        onEditItem={(item) => openModal("featuredDeals", item as FeaturedTile)}
        onAddItem={() => openModal("featuredDeals")}
      />

      <SectionList
        block={cmsData.hotDeals}
        renderItem={(product) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">Slug: {product.slug}</p>
            <p className="text-xs text-gray-400">
              KSh {product.price.toLocaleString()} ({product.badge || "no badge"})
            </p>
          </div>
        )}
        onEditItem={(item) => openModal("hotDeals", item as ProductHighlight)}
        onAddItem={() => openModal("hotDeals")}
      />

      <SectionList
        block={cmsData.printerScanner}
        renderItem={(product) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">{product.slug}</p>
          </div>
        )}
        onEditItem={(item) => openModal("printerScanner", item as ProductHighlight)}
        onAddItem={() => openModal("printerScanner")}
      />

      <SectionList
        block={cmsData.accessories}
        renderItem={(product) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">{product.slug}</p>
          </div>
        )}
        onEditItem={(item) => openModal("accessories", item as ProductHighlight)}
        onAddItem={() => openModal("accessories")}
      />

      <SectionList
        block={cmsData.audio}
        renderItem={(product) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">{product.slug}</p>
          </div>
        )}
        onEditItem={(item) => openModal("audio", item as ProductHighlight)}
        onAddItem={() => openModal("audio")}
      />

      <SectionList
        block={cmsData.popularBrands}
        renderItem={(brand) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{brand.title}</p>
            <p className="text-xs text-gray-500">{brand.slug}</p>
          </div>
        )}
        onEditItem={(item) => openModal("popularBrands", item as CategoryCardContent)}
        onAddItem={() => openModal("popularBrands")}
      />

      <SectionList
        block={cmsData.popularCategories}
        renderItem={(category) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{category.title}</p>
            <p className="text-xs text-gray-500">{category.slug}</p>
          </div>
        )}
        onEditItem={(item) => openModal("popularCategories", item as CategoryCardContent)}
        onAddItem={() => openModal("popularCategories")}
      />

      <Modal
        open={modalState.open}
        onClose={closeModal}
        title={modalState.itemId ? "Edit section item" : "Add section item"}
        description="Update content and links for this section."
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]" onClick={saveDraft}>
              Save changes
            </Button>
          </>
        }
      >
        {renderForm()}
      </Modal>
    </div>
  );
}



