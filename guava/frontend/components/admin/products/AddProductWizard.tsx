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
  editingProduct?: any;
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
  part_number: string;
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
  availability: string;
  campaigns: CampaignFlags;
  sections: SectionFlags;
  primary_image: string;
  gallery: string[];
  gallery_previews?: string[];
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
  part_number: "",
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
  availability: "in_stock",
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
  gallery_previews: [],
  supplier_id: "",
  supplier_name: "",
};

export function AddProductWizard({ open, onClose, onSuccess, editingProduct }: AddProductWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [creatingSupplier, setCreatingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", email: "", phone: "" });
  const [uploadingImages, setUploadingImages] = useState(false);

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
    setError(null);
  }, []);

  const generateSKU = useCallback(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKU-${timestamp}-${random}`;
  }, []);
  
  const closeWizard = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  useEffect(() => {
    if (!open) return;
    if (!editingProduct) {
      setFormData({
        ...initialData,
        sku: generateSKU(), // Auto-generate SKU for new products
      });
      return;
    }

    const primaryImage = editingProduct.image_url || editingProduct.image || editingProduct.image_url_write || "";
    const imagesList = Array.isArray(editingProduct.images)
      ? editingProduct.images.map((img: any) => img?.image_url || img?.url || img || "")
      : primaryImage
      ? [primaryImage]
      : [""];

    const featureList = editingProduct.feature_list?.length
      ? editingProduct.feature_list
      : editingProduct.features?.length
      ? editingProduct.features
      : [""];

    setFormData({
      name: editingProduct.name || "",
      sku: editingProduct.sku || "",
      description: editingProduct.description || "",
      tags: editingProduct.tags || [],
      features: featureList.length ? featureList : [""],
      condition: editingProduct.condition || "new",
      category_slug:
        editingProduct.category_slug || editingProduct.category_slug_write || editingProduct.category?.slug || "",
      subcategory_slug: editingProduct.subcategory_slug || "",
      brand_slug: editingProduct.brand_slug || editingProduct.brand_slug_write || editingProduct.brand?.slug || "",
      similar_categories: editingProduct.similar_categories || [],
      price: editingProduct.price ? String(editingProduct.price) : "",
      original_price: editingProduct.original_price ? String(editingProduct.original_price) : "",
      stock_quantity:
        editingProduct.stock_quantity !== undefined && editingProduct.stock_quantity !== null
          ? String(editingProduct.stock_quantity)
          : "",
      low_stock_threshold:
        editingProduct.low_stock_threshold !== undefined && editingProduct.low_stock_threshold !== null
          ? String(editingProduct.low_stock_threshold)
          : "5",
      campaigns: editingProduct.campaigns || initialData.campaigns,
      sections: editingProduct.sections || initialData.sections,
      primary_image: primaryImage,
      gallery: imagesList.length ? imagesList : [""],
      gallery_previews: imagesList.length ? imagesList : [primaryImage].filter(Boolean),
      supplier_id: editingProduct.supplier_id || "",
      supplier_name: editingProduct.supplier_name || "",
    });
  }, [editingProduct, open]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setUploadingImages(true);
      const formDataUpload = new FormData();
      Array.from(files).forEach((file) => formDataUpload.append("files", file));

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to upload images");
      }

      const data = await res.json();
      const urls: string[] = Array.isArray(data.urls) ? data.urls : [];
      if (!urls.length) throw new Error("No image URLs returned");

      setFormData((prev) => {
        const newGallery = [...(prev.gallery || []).filter(Boolean), ...urls];
        const primary = prev.primary_image || urls[0];
        return {
          ...prev,
          primary_image: primary,
          image_url_write: primary,
          gallery: newGallery,
          gallery_previews: newGallery,
        } as any;
      });
    } catch (err: any) {
      console.error("Image upload failed", err);
      setError(err?.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

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
  }, [open, resetState]);

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
      return { ...prev, gallery, gallery_previews: gallery };
    });
  };

  const addGallerySlot = () => {
    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ""], gallery_previews: [...(prev.gallery_previews || []), ""] }));
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

  const ensureAbsoluteUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // For relative paths, just return them as-is - Next.js will serve from public folder
    return url;
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validate mandatory fields
      if (!formData.name || formData.name.trim() === "") {
        setError("Product name is required. Please enter a product name.");
        setSaving(false);
        setStepIndex(0); // Go to details step
        return;
      }
      
      if (!formData.category_slug && !formData.subcategory_slug) {
        setError("Category is required. Please select a category from the dropdown.");
        setSaving(false);
        setStepIndex(3); // Go to categorization step
        return;
      }
      
      if (!formData.brand_slug || formData.brand_slug.trim() === "") {
        setError("Brand is required. Please select a brand from the dropdown.");
        setSaving(false);
        setStepIndex(3); // Go to categorization step
        return;
      }
      
      const galleryUrls = (formData.gallery || []).filter(Boolean);
      const primaryImageRaw = formData.primary_image || galleryUrls[0] || (formData.gallery_previews || []).find(Boolean);
      if (!primaryImageRaw || primaryImageRaw.trim() === "") {
        setError("Product image is required. Please provide at least one image URL or upload an image.");
        setSaving(false);
        setStepIndex(2); // Go to media step
        return;
      }
      
      const primaryImage = ensureAbsoluteUrl(primaryImageRaw.trim());
      const normalizedGallery = galleryUrls.map((url) => ensureAbsoluteUrl(url));
      
      const stockQty = Number(formData.stock_quantity || "0");
      if (isNaN(stockQty) || stockQty < 0) {
        setError("Stock quantity is required and must be a valid number (0 or greater).");
        setSaving(false);
        setStepIndex(1); // Go to inventory step
        return;
      }
      
      const payload = {
        name: formData.name.trim(),
        slug: slugify(formData.name),
        description: formData.description || "",
        price: Number(formData.price) || 0,
        original_price: Number(formData.original_price) || null,
        discount: 0,
        // Mandatory fields for serializer
        category_slug_write: formData.category_slug || formData.subcategory_slug,
        category_slug: formData.category_slug || formData.subcategory_slug,
        brand_slug_write: formData.brand_slug,
        stock_quantity_write: stockQty,
        image_url_write: primaryImage,
        // Additional fields
        subcategory_slug: formData.subcategory_slug || null,
        part_number_write: formData.part_number || null,
        availability_write: formData.availability || "in_stock",
        images: normalizedGallery.map((url, index) => ({
          image_url: url,
          alt_text: formData.name,
          order: index,
        })),
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
        stock_quantity: stockQty, // Keep for backward compatibility
        low_stock_threshold: Number(formData.low_stock_threshold || "5"),
        sku: formData.sku || null,
      };

      let response: Response;
      try {
        console.log("[AddProductWizard] Sending product creation request:", payload);
        const method = editingProduct ? "PUT" : "POST";
        const body = editingProduct
          ? { ...payload, id: editingProduct.id, slug: editingProduct.slug }
          : payload;
        response = await fetch("/api/admin/products", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        console.log("[AddProductWizard] Response received:", {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get("content-type")
        });
      } catch (fetchError: any) {
        // Handle network errors (fetch failed, CORS, etc.)
        console.error("[AddProductWizard] Network error during product creation:", fetchError);
        const networkError = fetchError.message || fetchError.toString() || "Network error";
        const errorMsg = `Failed to connect to server: ${networkError}. Please check if the backend is running.`;
        setError(errorMsg);
        setSaving(false);
        return;
      }

      if (!response.ok) {
        let errorMessage = "Failed to create product";
        try {
          // Check if response has content
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("Product creation error response:", errorData);
            
            // Check if errorData is empty
            if (!errorData || Object.keys(errorData).length === 0) {
              errorMessage = `HTTP ${response.status}: ${response.statusText || "Unknown error"}`;
            } else {
              // Helper to safely convert value to string
              const toString = (val: any): string => {
                if (val === null || val === undefined) return "";
                if (typeof val === 'string') return val;
                if (Array.isArray(val)) return val.map(toString).join(', ');
                if (typeof val === 'object') return JSON.stringify(val, null, 2);
                return String(val);
              };
              
              // Try to extract error message in priority order
              if (errorData?.error && typeof errorData.error === 'string') {
                errorMessage = errorData.error;
              } else if (errorData?.error && typeof errorData.error === 'object') {
                const fieldErrors = Object.entries(errorData.error)
                  .map(([key, value]) => `${key}: ${toString(value)}`)
                  .join('; ');
                errorMessage = fieldErrors || toString(errorData.error);
              } else if (errorData?.message && typeof errorData.message === 'string') {
                errorMessage = errorData.message;
              } else if (errorData?.detail) {
                if (typeof errorData.detail === 'string') {
                  errorMessage = errorData.detail;
                } else if (typeof errorData.detail === 'object') {
                  // Handle field-specific errors
                  const fieldErrors = Object.entries(errorData.detail)
                    .map(([key, value]) => `${key}: ${toString(value)}`)
                    .join('; ');
                  errorMessage = fieldErrors || toString(errorData.detail);
                } else {
                  errorMessage = toString(errorData.detail);
                }
              } else if (errorData?.details) {
                // Handle details object (don't use it directly as string)
                if (typeof errorData.details === 'object') {
                  // Extract meaningful info from details
                  const detailsStr = Object.entries(errorData.details)
                    .map(([key, value]) => `${key}: ${toString(value)}`)
                    .join('; ');
                  if (detailsStr) {
                    errorMessage = detailsStr;
                  } else {
                    errorMessage = toString(errorData.details);
                  }
                } else {
                  errorMessage = toString(errorData.details);
                }
              } else {
                // Fallback: try to extract any string values from the error object
                const allErrors = Object.entries(errorData)
                  .filter(([key]) => !['details', 'error', 'message', 'detail'].includes(key))
                  .map(([key, value]) => `${key}: ${toString(value)}`)
                  .join('; ');
                if (allErrors) {
                  errorMessage = allErrors;
                } else {
                  errorMessage = `HTTP ${response.status}: ${response.statusText || "Unknown error"}`;
                }
              }
            }
          } else {
            // Not JSON, try to get text
            const errorText = await response.text();
            errorMessage = errorText || `HTTP ${response.status}: ${response.statusText || "Unknown error"}`;
          }
        } catch (e: any) {
          // If JSON parsing fails or response.text() fails, use status
          console.error("Error parsing error response:", e);
          errorMessage = `HTTP ${response.status}: ${response.statusText || "Unknown error"}. ${e.message || ""}`;
        }
        
        // Ensure errorMessage is always a string
        if (typeof errorMessage !== 'string') {
          errorMessage = JSON.stringify(errorMessage, null, 2);
        }
        
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const product = await response.json();
      console.log("Product saved successfully:", product);
      
      onSuccess();
      resetState();
      setError(null);
    } catch (error: any) {
      console.error("Failed to save product", error);
      const errorMessage = error?.message || error?.toString() || "Failed to create product. Please check the console for details.";
      if (!error) {
        setError(errorMessage);
      }
      // Don't close the modal on error, let user see the error and retry
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
          <label className="block text-base font-semibold mb-2 text-gray-700">Part Number / Model No</label>
          <Input
            placeholder="Enter manufacturer part number"
            value={formData.part_number}
            onChange={(e) => setFormData((prev) => ({ ...prev, part_number: e.target.value }))}
            className="rounded-none h-12 text-base"
          />
        </div>
      </div>
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">Stock Keeping Unit (SKU)</label>
        <div className="flex gap-2">
          <Input
            placeholder="Auto-generated SKU"
            value={formData.sku}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
            className="rounded-none h-12 text-base flex-1"
            readOnly={!editingProduct}
          />
          {!editingProduct && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData((prev) => ({ ...prev, sku: generateSKU() }))}
              className="rounded-none h-12"
            >
              Regenerate
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {editingProduct ? "SKU can be edited" : "Auto-generated, click regenerate for a new one"}
        </p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <label className="block text-base font-semibold mb-2 text-gray-700">Availability Status</label>
          <select
            value={formData.availability}
            onChange={(e) => setFormData((prev) => ({ ...prev, availability: e.target.value }))}
            className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
          >
            <option value="in_stock">Ex-Stock</option>
            <option value="check_availability">Check Availability</option>
            <option value="expecting">Expecting</option>
            <option value="special_offer">Special Offer</option>
            <option value="clearance">Clearance Price</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
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
          <label className="block text-base font-semibold mb-2 text-gray-700">Upload Images</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="text-sm"
            />
            {uploadingImages && <span className="text-sm text-gray-600">Uploading...</span>}
          </div>
          {formData.gallery_previews?.length ? (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {formData.gallery_previews.map((img, idx) => (
                <div key={idx} className="relative w-full h-28 border border-gray-200 bg-gray-50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
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
          <p className="text-base font-semibold mb-3 text-gray-700">Gallery Images (URLs)</p>
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
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          {categories.length === 0 ? (
            <div className="border border-yellow-300 bg-yellow-50 px-4 py-3 rounded-none text-base w-full h-12 flex items-center">
              <span className="text-yellow-800 text-sm">
                No categories available. Please create a category first.
              </span>
            </div>
          ) : (
            <select
              value={formData.category_slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, category_slug: e.target.value }))}
              className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
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

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Error creating product</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}
          {renderStepContent()}
        </div>

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

