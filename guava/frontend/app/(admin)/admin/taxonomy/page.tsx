"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/admin/homepage/Modal";
import { CategoryTaxonomy } from "@/lib/types/taxonomy";
import { CategoryTaxonomyForm } from "@/components/admin/taxonomy/CategoryTaxonomyForm";

interface TaxonomyState {
  categories: CategoryTaxonomy[];
}

export default function AdminTaxonomyPage() {
  const [data, setData] = useState<TaxonomyState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    draft: CategoryTaxonomy | null;
    itemId: string | null;
  }>({ open: false, draft: null, itemId: null });

  const fetchTaxonomy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/taxonomy");
      const payload = (await response.json()) as TaxonomyState;
      setData(payload);
    } catch (error) {
      console.error("Failed to load taxonomy", error);
      setStatusMessage({ type: "error", text: "Failed to load taxonomy data" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const openModal = (item?: CategoryTaxonomy) => {
    const draft =
      item ??
      ({
        id: crypto.randomUUID(),
        title: "",
        slug: "",
      } as CategoryTaxonomy);
    setModalState({ open: true, draft, itemId: item ? item.id : null });
  };

  const closeModal = () => setModalState({ open: false, draft: null, itemId: null });

  const handleSave = async () => {
    if (!data || !modalState.draft) return;
    const categories = modalState.itemId
      ? data.categories.map((cat) => (cat.id === modalState.itemId ? modalState.draft! : cat))
      : [...data.categories, modalState.draft];
    const next = { categories };

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const response = await fetch("/api/admin/taxonomy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!response.ok) throw new Error("Request failed");
      setData(next);
      setStatusMessage({ type: "success", text: "Category saved" });
      closeModal();
    } catch (error) {
      console.error("Failed to save taxonomy entry", error);
      setStatusMessage({ type: "error", text: "Failed to save category" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !data) {
    return <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Taxonomy & SEO"
        description="Manage categories, hierarchies, and SEO metadata."
        actions={
          <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]" onClick={() => openModal()}>
            Add category
          </Button>
        }
      />

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

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Meta title</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{category.title}</td>
                  <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{category.metaTitle || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{(category.tags || []).join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" onClick={() => openModal(category)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modalState.open}
        onClose={closeModal}
        title={modalState.itemId ? "Edit category" : "Add category"}
        description="Update titles, slug, parent category, and SEO metadata."
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </>
        }
      >
        {modalState.draft && (
          <CategoryTaxonomyForm
            value={modalState.draft}
            onChange={(val) => setModalState((prev) => ({ ...prev, draft: val }))}
            parentOptions={data.categories}
          />
        )}
      </Modal>
    </div>
  );
}

