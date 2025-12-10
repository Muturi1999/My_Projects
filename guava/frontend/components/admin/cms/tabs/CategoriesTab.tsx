"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { adminApiClient } from "@/lib/admin-api/client";
import { shopCategories } from "@/lib/data/categories";
import Link from "next/link";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Modal } from "@/components/admin/homepage/Modal";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  order?: number;
}

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    category: Category | null;
    isEdit: boolean;
  }>({ open: false, category: null, isEdit: false });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/catalog/categories?page=1&pageSize=100");
      const result = await response.json();
      setCategories(result.results || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setStatusMessage({ type: "error", text: "Failed to load categories" });
      // Fallback to static data
      setCategories(shopCategories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setModalState({
      open: true,
      category: {
        id: "",
        name: "",
        slug: "",
        icon: "",
        image: "",
        description: "",
        order: categories.length,
      },
      isEdit: false,
    });
  };

  const openEditModal = (category: Category) => {
    setModalState({
      open: true,
      category: { ...category },
      isEdit: true,
    });
  };

  const closeModal = () => {
    setModalState({ open: false, category: null, isEdit: false });
  };

  const handleSave = async () => {
    if (!modalState.category) return;

    const { name, slug, icon, image, description, order } = modalState.category;

    if (!name || !slug) {
      setStatusMessage({ type: "error", text: "Name and slug are required" });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const categoryData = {
        name,
        slug,
        icon: icon || "",
        image: image || "",
        description: description || "",
        order: order || 0,
      };

      if (modalState.isEdit && modalState.category.id) {
        // Update existing category
        const response = await fetch("/api/admin/catalog/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: modalState.category.id, ...categoryData }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to update category");
        }
        
        setStatusMessage({ type: "success", text: "Category updated successfully" });
      } else {
        // Create new category
        const response = await fetch("/api/admin/catalog/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });
        
        if (!response.ok) {
          throw new Error("Failed to create category");
        }
        
        setStatusMessage({ type: "success", text: "Category created successfully" });
      }

      closeModal();
      await fetchCategories(); // Refresh list
      
      // Trigger a custom event to refresh frontend categories
      window.dispatchEvent(new CustomEvent("categories:updated"));
    } catch (error: any) {
      console.error("Failed to save category", error);
      setStatusMessage({
        type: "error",
        text: error.message || "Failed to save category",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/catalog/categories?id=${category.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      
      setStatusMessage({ type: "success", text: "Category deleted successfully" });
      await fetchCategories(); // Refresh list
      
      // Trigger a custom event to refresh frontend categories
      window.dispatchEvent(new CustomEvent("categories:updated"));
    } catch (error: any) {
      console.error("Failed to delete category", error);
      setStatusMessage({
        type: "error",
        text: error.message || "Failed to delete category",
      });
    }
  };

  // Split categories into rows of 6
  const firstRow = categories.slice(0, 6);
  const secondRow = categories.slice(6, 12);
  const remainingCategories = categories.slice(12);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Shop by Category</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage categories displayed on the homepage. Total: {categories.length} categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]"
            size="sm"
            onClick={openCreateModal}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Category
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
        <div className="space-y-6">
          {/* First Row (6 categories) */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">First Row (6 categories)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {firstRow.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#A7E059] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{category.name}</p>
                    <p className="text-xs text-gray-500 truncate">{category.slug}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1.5 text-gray-600 hover:text-[#A7E059] transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {firstRow.length < 6 && (
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                  Empty slot
                </div>
              )}
            </div>
          </div>

          {/* Second Row (6 categories) */}
          {secondRow.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Second Row (6 categories)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {secondRow.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#A7E059] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{category.name}</p>
                      <p className="text-xs text-gray-500 truncate">{category.slug}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1.5 text-gray-600 hover:text-[#A7E059] transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {secondRow.length < 6 && (
                  <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                    Empty slot
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Remaining Categories */}
          {remainingCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Additional Categories ({remainingCategories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {remainingCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#A7E059] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{category.name}</p>
                      <p className="text-xs text-gray-500 truncate">{category.slug}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1.5 text-gray-600 hover:text-[#A7E059] transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No categories found. Click "Add Category" to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalState.open}
        onClose={closeModal}
        title={modalState.isEdit ? "Edit Category" : "Create Category"}
        description={modalState.isEdit ? "Update category details" : "Add a new category to the shop"}
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        {modalState.category && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modalState.category.name}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    category: prev.category ? { ...prev.category, name: e.target.value } : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                placeholder="e.g., Laptops & Computers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modalState.category.slug}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    category: prev.category
                      ? { ...prev.category, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }
                      : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                placeholder="e.g., laptops-computers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <input
                type="text"
                value={modalState.category.icon || ""}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    category: prev.category ? { ...prev.category, icon: e.target.value } : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                placeholder="e.g., laptop, keyboard, monitor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={modalState.category.image || ""}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    category: prev.category ? { ...prev.category, image: e.target.value } : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={modalState.category.description || ""}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    category: prev.category ? { ...prev.category, description: e.target.value } : null,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                placeholder="Category description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                value={modalState.category.order || 0}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    category: prev.category
                      ? { ...prev.category, order: parseInt(e.target.value) || 0 }
                      : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
