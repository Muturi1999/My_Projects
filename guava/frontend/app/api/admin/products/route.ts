import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/config/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api";

// Helper to get auth token (when authentication is integrated)
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const category_slug = searchParams.get("category_slug");
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";
    const search = searchParams.get("search") || "";

    // Get single product by slug
    if (slug) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/queries/${slug}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const product = await response.json();
        return NextResponse.json(product);
      } catch (error: any) {
        console.error("Error fetching product by slug:", error);
        return NextResponse.json(
          { error: "Failed to connect to backend", message: error.message },
          { status: 503 }
        );
      }
    }

    // Get single product by ID
    if (id) {
      try {
        // First try to get all products and find by ID
        const response = await fetch(
          `${API_BASE_URL}/products/queries/?page=1&page_size=1000`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const product = data.results?.find((p: any) => p.id?.toString() === id);
          if (product) {
            return NextResponse.json(product);
          }
        }
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      } catch (error: any) {
        console.error("Error fetching product by ID:", error);
        return NextResponse.json(
          { error: "Failed to connect to backend", message: error.message },
          { status: 503 }
        );
      }
    }

    // Build query params
    const params = new URLSearchParams({
      page,
      page_size: pageSize,
    });

    if (search) {
      params.append("search", search);
    }

    if (category_slug) {
      params.append("category_slug", category_slug);
    }

    // Get paginated products from Django backend
    const url = `${API_BASE_URL}/products/queries/?${params.toString()}`;
    console.log("[Products API] Fetching from:", url);
    console.log("[Products API] API_BASE_URL:", API_BASE_URL);
    
    let response: Response;
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        return NextResponse.json(
          { 
            error: "Backend request timeout",
            message: "The backend server did not respond in time. Please ensure Django server is running on port 8000."
          },
          { status: 504 }
        );
      }
      if (fetchError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { 
            error: "Backend connection refused",
            message: "Cannot connect to Django backend. Please ensure the server is running on http://localhost:8000"
          },
          { status: 503 }
        );
      }
      throw fetchError;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Django API error:", response.status, errorText);
      return NextResponse.json(
        { 
          error: "Failed to fetch products from backend",
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError: any) {
      console.error("[Products API] Failed to parse JSON response:", jsonError);
      const text = await response.text();
      console.error("[Products API] Response text:", text);
      throw new Error(`Invalid JSON response from backend: ${jsonError.message}`);
    }

    console.log("[Products API] Received data:", { count: data.count, resultsCount: data.results?.length });

    // Transform Django response to match frontend format
    const transformed = {
      results: data.results || [],
      count: data.count || 0,
      page: data.current_page || parseInt(page),
      pageSize: data.page_size || parseInt(pageSize),
      totalPages: data.total_pages || Math.ceil((data.count || 0) / parseInt(pageSize)),
      hasNext: !!data.next,
      hasPrevious: !!data.previous,
    };
    
    console.log("[Products API] Transformed response:", transformed);
    return NextResponse.json(transformed);
  } catch (error: any) {
    console.error("Failed to fetch products", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Failed to fetch products",
        results: [],
        count: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transform frontend payload to Django format
    const categorySlug = body.subcategory_slug || body.category_slug || body.category_slug_write;
    if (!categorySlug || categorySlug.trim() === '') {
      return NextResponse.json(
        { error: "Category is required. Please select a category or subcategory." },
        { status: 400 }
      );
    }

    // Get mandatory fields (with fallbacks for backward compatibility)
    const brandSlug = body.brand_slug_write || body.brand_slug;
    const stockQty = body.stock_quantity_write !== undefined ? body.stock_quantity_write : (parseInt(body.stock_quantity) || 0);
    const imageUrl = body.image_url_write || body.primary_image || body.image || (body.images && body.images.length > 0 ? (typeof body.images[0] === 'string' ? body.images[0] : body.images[0].image_url) : null);
    
    const djangoPayload: any = {
      name: body.name,
      description: body.description || "",
      price: parseFloat(body.price) || 0,
      original_price: parseFloat(body.original_price) || null,
      category_slug_write: categorySlug,
      brand_slug_write: brandSlug, // Now mandatory
      stock_quantity_write: stockQty, // Now mandatory
      image_url_write: imageUrl, // Now mandatory
      hot: body.sections?.hot || false,
      featured: body.sections?.featured || false,
      sku: body.sku || null,
      tags: body.tags || [],
      condition: body.condition || "new",
    };

    // Add additional fields that need special handling
    const images_data = body.images || [];
    const feature_list = body.feature_list || [];

    // Add these to the payload (they'll be extracted in the view)
    djangoPayload.images = images_data;
    djangoPayload.feature_list = feature_list;
    
    // Keep stock_quantity for backward compatibility (but use stock_quantity_write as primary)
    djangoPayload.stock_quantity = stockQty;

    console.log("[Products API] Sending payload to Django:", JSON.stringify(djangoPayload, null, 2));

    // Create product in Django backend
    let response: Response;
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      response = await fetch(`${API_BASE_URL}/products/queries/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add auth token when available
          // Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(djangoPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error("[Products API] Fetch error:", fetchError);
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        return NextResponse.json(
          {
            error: "Backend request timeout",
            message: "The backend server did not respond in time. Please ensure Django server is running on port 8000."
          },
          { status: 504 }
        );
      }
      if (fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('ECONNREFUSED')) {
        return NextResponse.json(
          {
            error: "Backend connection refused",
            message: "Cannot connect to Django backend. Please ensure the server is running on http://localhost:8000"
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error: "Network error",
          message: fetchError.message || "Failed to connect to backend server"
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      let errorData: any = {};
      let errorText = '';
      const contentType = response.headers.get("content-type");
      
      try {
        // Clone response to read it without consuming the original
        const clonedResponse = response.clone();
        
        // Try to parse as JSON first
        if (contentType && contentType.includes("application/json")) {
          try {
            errorData = await response.json();
            console.error("[Products API] Django error response (JSON):", {
              status: response.status,
              statusText: response.statusText,
              errorData
            });
          } catch (jsonError) {
            // If JSON parsing fails, try text
            console.error("[Products API] JSON parse failed, trying text:", jsonError);
            errorText = await clonedResponse.text();
            errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
          }
        } else {
          // Not JSON, read as text
          errorText = await response.text();
          console.error("[Products API] Django error response (text):", {
            status: response.status,
            statusText: response.statusText,
            body: errorText.substring(0, 500)
          });
          errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
      } catch (e: any) {
        console.error("[Products API] Error reading response:", e);
        errorData = { 
          error: `HTTP ${response.status}: ${response.statusText || "Unknown error"}`,
          message: e.message || "Failed to read error response"
        };
      }
      
      console.error("[Products API] Final parsed error data:", errorData);
      
      // Extract error message from various possible formats
      let errorMessage = "Failed to create product";
      
      if (errorData.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (typeof errorData.detail === 'object' && errorData.detail !== null) {
          // Handle field-specific errors
          const fieldErrors = Object.entries(errorData.detail)
            .map(([key, value]: [string, any]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`;
              }
              return `${key}: ${value}`;
            })
            .join('; ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else {
          errorMessage = String(errorData.detail);
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorText) {
        errorMessage = errorText;
      } else if (Object.keys(errorData).length > 0) {
        // If errorData has keys but no standard error fields, stringify it
        errorMessage = JSON.stringify(errorData);
      } else {
        errorMessage = `HTTP ${response.status}: ${response.statusText || "Unknown error"}`;
      }
      
      // Return error in a format that's easy to parse on the frontend
      // Always include error and message fields for consistency
      const errorResponse: Record<string, any> = {
        error: errorMessage,
        message: errorMessage,
        status: response.status
      };
      
      // Include detail if errorData is not empty and has content
      if (errorData && typeof errorData === 'object' && errorData !== null && !Array.isArray(errorData) && Object.keys(errorData).length > 0) {
        errorResponse.detail = errorData;
      }
      
      console.error("[Products API] Returning error response:", errorResponse);
      
      return NextResponse.json(
        errorResponse,
        { status: response.status }
      );
    }

    const product = await response.json();

    // Create product images if provided
    if (body.images && body.images.length > 0) {
      // Images will be handled by the backend create method
      // But we can also create them separately if needed
      for (const img of body.images) {
        try {
          await fetch(`${API_BASE_URL}/products/queries/${product.slug}/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              images: [img],
            }),
          });
        } catch (err) {
          console.error("Failed to add image", err);
        }
      }
    }

    // Create specifications with features
    if (body.feature_list && body.feature_list.length > 0) {
      // Features are handled in the create method
      // But we can update specifications if needed
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, slug, ...data } = body;

    if (!slug && !id) {
      return NextResponse.json({ error: "Slug or ID is required" }, { status: 400 });
    }

    // Transform frontend payload to Django format
    const categorySlug = data.subcategory_slug || data.category_slug || data.category_slug_write;
    const brandSlug = data.brand_slug || data.brand_slug_write;
    const stockQty =
      data.stock_quantity_write !== undefined
        ? data.stock_quantity_write
        : data.stock_quantity !== undefined
        ? data.stock_quantity
        : undefined;
    const imageUrl = data.image_url_write || data.image_url || data.primary_image || data.image;
    const partNumber = data.part_number_write || data.part_number;
    const availability = data.availability_write || data.availability;
    const subcategory = data.subcategory_slug || data.subcategory;

    const djangoPayload: any = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price) || 0,
      original_price: parseFloat(data.original_price) || null,
      hot: data.sections?.hot || data.hot || false,
      featured: data.sections?.featured || data.featured || false,
      sku: data.sku,
      tags: data.tags || [],
      condition: data.condition || "new",
    };

    if (categorySlug) {
      djangoPayload.category_slug_write = categorySlug;
    }

    if (brandSlug) {
      djangoPayload.brand_slug_write = brandSlug;
    }

    if (stockQty !== undefined) {
      djangoPayload.stock_quantity_write = stockQty;
    }

    if (imageUrl) {
      djangoPayload.image_url_write = imageUrl;
    }

    if (partNumber) {
      djangoPayload.part_number_write = partNumber;
    }

    if (availability) {
      djangoPayload.availability_write = availability;
    }

    if (subcategory) {
      djangoPayload.subcategory_slug = subcategory;
    }

    // Update product in Django backend
    const productSlug = slug || id;
    const response = await fetch(`${API_BASE_URL}/products/queries/${productSlug}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(djangoPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || error.message || "Failed to update product" },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Failed to update product", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!slug && !id) {
      return NextResponse.json({ error: "Slug or ID is required" }, { status: 400 });
    }

    // Delete product from Django backend
    const productSlug = slug || id;
    const response = await fetch(`${API_BASE_URL}/products/queries/${productSlug}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || error.message || "Failed to delete product" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
