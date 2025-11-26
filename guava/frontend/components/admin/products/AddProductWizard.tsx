"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { slugify } from "@/lib/utils/slugify";
import { formatKES } from "@/lib/utils/format";

interface AddProductWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SupplierOption {
  id: string;
  name: string;
  contact_name?: string;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface BrandOption {
  id: string;
  name: string;
  slug: string;
}

type CampaignFlags = {
  flashSale: boolean;
  discount: boolean;
  christmas: boolean;
  seasonal: boolean;
  valentine: boolean;
  publicHoliday: boolean;
  custom: string;
};

type CampaignToggleKey = Exclude<keyof CampaignFlags, "custom">;

type SectionFlags = {
  featured: boolean;
  hot: boolean;
  clearance: boolean;
};

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  tags: string[];
  features: string[];
  condition: string;
  category_slug: string;
  subcategory_slug: string;
  brand_slug: string;
  similar_categories: string[];
  price: string;
  original_price: string;
  stock_quantity: string;
  low_stock_threshold: string;
  campaigns: CampaignFlags;
  sections: SectionFlags;
  primary_image: string;
  gallery: string[];
  supplier_id: string;
  supplier_name: string;
}

const steps = [
  { id: "details", label: "Product Details" },
  { id: "inventory", label: "Inventory & Pricing" },
  { id: "media", label: "Media" },
  { id: "categorization", label: "Categorization & Supplier" },
  { id: "review", label: "Review & Publish" },
];

const initialData: ProductFormData = {
  name: "",
  sku: "",
  description: "",
  tags: [] as string[],
  features: [""],
  condition: "new",
  category_slug: "",
  subcategory_slug: "",
  brand_slug: "",
  similar_categories: [] as string[],
  price: "",
  original_price: "",
  stock_quantity: "",
  low_stock_threshold: "5",
  campaigns: {
    flashSale: false,
    discount: false,
    christmas: false,
    seasonal: false,
    valentine: false,
    publicHoliday: false,
    custom: "",
  },
  sections: {
    featured: false,
    hot: false,
    clearance: false,
  },
  primary_image: "",
  gallery: [""],
  supplier_id: "",
  supplier_name: "",
};

export function AddProductWizard({ open, onClose, onSuccess }: AddProductWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [creatingSupplier, setCreatingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", email: "", phone: "" });

  const currentStep = steps[stepIndex];

  const canGoNext = useMemo(() => {
    if (currentStep.id === "details") {
      return Boolean(formData.name && formData.sku);
    }
    if (currentStep.id === "inventory") {
      return Boolean(formData.price && formData.original_price);
    }
    if (currentStep.id === "categorization") {
      return Boolean(formData.category_slug);
    }
    return true;
  }, [currentStep.id, formData]);

  const resetState = useCallback(() => {
    setFormData(initialData);
    setStepIndex(0);
    setNewSupplier({ name: "", email: "", phone: "" });
  }, []);

  useEffect(() => {
    if (!open) return;
    const loadOptions = async () => {
      try {
        const [categoryRes, brandRes, supplierRes] = await Promise.all([
          fetch("/api/admin/catalog/categories"),
          fetch("/api/admin/catalog/brands"),
          fetch("/api/admin/suppliers"),
        ]);

        const categoryData = await categoryRes.json();
        const brandData = await brandRes.json();
        const supplierData = await supplierRes.json();

        const catList = Array.isArray(categoryData?.results)
          ? categoryData.results
          : Array.isArray(categoryData)
          ? categoryData
          : [];
        const brandList = Array.isArray(brandData?.results)
          ? brandData.results
          : Array.isArray(brandData)
          ? brandData
          : [];
        const supplierList = Array.isArray(supplierData?.results)
          ? supplierData.results
          : Array.isArray(supplierData)
          ? supplierData
          : [];

        setCategories(catList);
        setBrands(brandList);
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Failed to load form options", error);
      }
    };

    loadOptions();
  }, [open]);

  const closeWizard = () => {
    resetState();
    onClose();
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  };

  const handleGalleryChange = (index: number, value: string) => {
    setFormData((prev) => {
      const gallery = [...prev.gallery];
      gallery[index] = value;
      return { ...prev, gallery };
    });
  };

  const addGallerySlot = () => {
    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ""] }));
  };

  const handleCreateSupplier = async () => {
    if (!newSupplier.name.trim()) return;
    setCreatingSupplier(true);
    try {
      const response = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSupplier.name.trim(),
          email: newSupplier.email.trim(),
          phone: newSupplier.phone.trim(),
        }),
      });
      if (!response.ok) throw new Error("Failed to create supplier");
      const supplier = await response.json();
      setSuppliers((prev) => [supplier, ...prev]);
      setFormData((prev) => ({
        ...prev,
        supplier_id: supplier.id,
        supplier_name: supplier.name,
      }));
      setNewSupplier({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingSupplier(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description,
        price: Number(formData.price),
        original_price: Number(formData.original_price),
        discount: 0,
        image: formData.primary_image || formData.gallery.find(Boolean) || "https://via.placeholder.com/600x600.png",
        images: formData.gallery.filter(Boolean).map((url, index) => ({
          image_url: url,
          alt_text: formData.name,
          order: index,
        })),
        category_slug: formData.category_slug,
        subcategory_slug: formData.subcategory_slug || null,
        brand_slug: formData.brand_slug || null,
        supplier_id: formData.supplier_id || null,
        supplier_name: formData.supplier_name || "",
        tags: formData.tags,
        feature_list: formData.features.filter(Boolean),
        condition: formData.condition,
        sections: formData.sections,
        campaigns: formData.campaigns,
        extra_attributes: {
          similar_categories: formData.similar_categories,
        },
        stock_quantity: Number(formData.stock_quantity || "0"),
        low_stock_threshold: Number(formData.low_stock_threshold || "5"),
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to create product");
      }

      onSuccess();
      resetState();
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Product Name</label>
          <Input
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Stock Keeping Unit (SKU)</label>
          <Input
            placeholder="Enter Stock Keeping Unit"
            value={formData.sku}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
      </div>
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">Description</label>
        <Textarea
          placeholder="Enter product description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="rounded-none min-h-[140px] text-base"
        />
      </div>
      <div>
        <p className="text-base font-semibold mb-3 text-gray-700">Condition</p>
        <div className="flex gap-6 text-base">
          {["new", "refurbished"].map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="condition"
                value={option}
                checked={formData.condition === option}
                onChange={() => setFormData((prev) => ({ ...prev, condition: option }))}
                className="w-5 h-5"
              />
              <span>{option === "new" ? "New" : "Refurbished"}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-base font-semibold mb-3 text-gray-700">Features</p>
        {formData.features.map((feature, index) => (
          <Input
            key={`feature-${index}`}
            value={feature}
            placeholder="Enter feature"
            onChange={(e) => handleFeatureChange(index, e.target.value)}
            className="rounded-none mb-3 h-12 text-base"
          />
        ))}
        <Button variant="outline" className="rounded-none h-11 text-base" onClick={handleAddFeature}>
          + Add Feature
        </Button>
      </div>
    </div>
  );

  const renderInventoryStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Price (KES)</label>
          <Input
            placeholder="Enter price in KES"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Original Price (KES)</label>
          <Input
            placeholder="Enter original price in KES"
            type="number"
            value={formData.original_price}
            onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Stock Quantity</label>
          <Input
            placeholder="Enter stock quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
      </div>
      <div>
        <p className="text-base font-semibold mb-3 text-gray-700">Campaign Options</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["flashSale", "discount", "seasonal", "christmas", "valentine", "publicHoliday"] as CampaignToggleKey[]).map((flag) => (
            <label key={flag} className="flex items-center gap-3 text-base cursor-pointer">
              <Checkbox
                checked={formData.campaigns[flag]}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    campaigns: { ...prev.campaigns, [flag]: Boolean(checked) },
                  }))
                }
                className="w-5 h-5"
              />
              <span>{flag.replace(/([A-Z])/g, " $1")}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">Custom Campaign Label</label>
        <Input
          placeholder="Enter custom campaign label"
          value={formData.campaigns.custom}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              campaigns: { ...prev.campaigns, custom: e.target.value },
            }))
          }
          className="rounded-none h-12 text-base"
        />
      </div>
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">Primary Image URL</label>
        <Input
          placeholder="Enter primary image URL"
          value={formData.primary_image}
          onChange={(e) => setFormData((prev) => ({ ...prev, primary_image: e.target.value }))}
          className="rounded-none h-12 text-base"
        />
      </div>
      <div>
        <p className="text-base font-semibold mb-3 text-gray-700">Gallery Images</p>
        {formData.gallery.map((image, index) => (
          <Input
            key={`gallery-${index}`}
            value={image}
            placeholder="Enter image URL"
            onChange={(e) => handleGalleryChange(index, e.target.value)}
            className="rounded-none mb-3 h-12 text-base"
          />
        ))}
        <Button variant="outline" className="rounded-none h-11 text-base" onClick={addGallerySlot}>
          + Add Image
        </Button>
      </div>
    </div>
  );

  const renderCategorizationStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Category</label>
          <select
            value={formData.category_slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_slug: e.target.value }))}
            className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Sub Category (Optional)</label>
          <Input
            placeholder="Enter sub category"
            value={formData.subcategory_slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, subcategory_slug: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Brand</label>
          <select
            value={formData.brand_slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, brand_slug: e.target.value }))}
            className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Supplier</label>
          <select
            value={formData.supplier_id}
            onChange={(e) => {
              const supplier = suppliers.find((sup) => sup.id === e.target.value);
              setFormData((prev) => ({
                ...prev,
                supplier_id: e.target.value,
                supplier_name: supplier?.name || "",
              }));
            }}
            className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
          >
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="border border-gray-200 p-6 space-y-4">
        <p className="text-base font-semibold text-gray-700">Add New Supplier</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Enter supplier name"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
          <Input
            placeholder="Enter email"
            value={newSupplier.email}
            onChange={(e) => setNewSupplier((prev) => ({ ...prev, email: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
          <Input
            placeholder="Enter phone (e.g., +254 712 345 678)"
            value={newSupplier.phone}
            onChange={(e) => setNewSupplier((prev) => ({ ...prev, phone: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
        <Button
          className="bg-[#98C243] hover:bg-[#85AC3A] text-white rounded-none h-11 text-base font-semibold w-fit"
          onClick={handleCreateSupplier}
          disabled={creatingSupplier || !newSupplier.name.trim()}
        >
          {creatingSupplier ? "Creating..." : "Create Supplier"}
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-700">Name</p>
          <p>{formData.name}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Stock Keeping Unit (SKU)</p>
          <p className="text-base">{formData.sku}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Category</p>
          <p>{formData.category_slug || "—"}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Supplier</p>
          <p>{formData.supplier_name || "—"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="font-semibold text-gray-700">Price</p>
          <p className="text-base">{formatKES(parseFloat(formData.price) || 0)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Original Price</p>
          <p className="text-base">{formatKES(parseFloat(formData.original_price) || 0)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Stock</p>
          <p className="text-base">{formData.stock_quantity || 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="font-semibold text-gray-700">Condition</p>
          <p className="text-base">{formData.condition === "new" ? "New" : "Refurbished"}</p>
        </div>
      </div>
      <div>
        <p className="font-semibold text-gray-700">Campaigns</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(formData.campaigns)
            .filter(([key, value]) => key !== "custom" && value)
            .map(([key]) => (
              <span key={key} className="px-2 py-1 bg-gray-100 text-xs uppercase tracking-wide">
                {key}
              </span>
            ))}
          {formData.campaigns.custom && (
            <span className="px-2 py-1 bg-gray-100 text-xs uppercase tracking-wide">
              {formData.campaigns.custom}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep.id) {
      case "details":
        return renderDetailsStep();
      case "inventory":
        return renderInventoryStep();
      case "media":
        return renderMediaStep();
      case "categorization":
        return renderCategorizationStep();
      case "review":
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col rounded-none">
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-5">
          <div>
            <p className="text-2xl font-semibold">Add Product</p>
            <p className="text-sm text-gray-500">
              Step {stepIndex + 1} of {steps.length}
            </p>
          </div>
          <button onClick={closeWizard} className="text-gray-500 hover:text-gray-900 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="flex gap-2 border-b border-gray-200 px-8 py-4 text-sm uppercase tracking-wide">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 text-gray-600">
              <span
                className={`px-3 py-1.5 text-sm ${
                  index === stepIndex ? "bg-[#98C243] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {index + 1}
              </span>
              <span className={index === stepIndex ? "text-gray-900 font-semibold" : ""}>{step.label}</span>
              {index < steps.length - 1 && <span className="text-gray-300">›</span>}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">{renderStepContent()}</div>

        <div className="flex items-center justify-between border-t border-gray-200 px-8 py-5">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-none h-11 text-base px-6"
              onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
              disabled={stepIndex === 0}
            >
              Back
            </Button>
            <Button variant="outline" className="rounded-none h-11 text-base px-6" onClick={closeWizard}>
              Cancel
            </Button>
          </div>
          {stepIndex === steps.length - 1 ? (
            <Button
              className="bg-[#98C243] hover:bg-[#85AC3A] text-white rounded-none px-8 h-11 text-base font-semibold"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Product"}
            </Button>
          ) : (
            <Button
              className="bg-[#98C243] hover:bg-[#85AC3A] text-white rounded-none px-8 h-11 text-base font-semibold"
              onClick={() => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
              disabled={!canGoNext}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

