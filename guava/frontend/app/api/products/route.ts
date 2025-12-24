import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/config/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const category_slug = searchParams.get("category_slug");
    const brand_slug = searchParams.get("brand_slug");
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";
    const search = searchParams.get("search") || "";

    // Get single product by slug (most common for SEO-friendly URLs)
    if (slug) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/queries/${slug}/`, {
          headers: {
            "Content-Type": "application/json",
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const product = await response.json();
          return NextResponse.json(product);
        } else {
          // If slug not found, try as ID
          const response2 = await fetch(`${API_BASE_URL}/products/queries/?page=1&page_size=1000`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (response2.ok) {
            const data = await response2.json();
            const productById = data.results?.find((p: any) => p.id?.toString() === slug);
            if (productById) {
              return NextResponse.json(productById);
            }
          }
        }
        
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      } catch (error: any) {
        console.error("Error fetching product by slug:", error);
        return NextResponse.json(
          { error: "Failed to fetch product", message: error.message },
          { status: 503 }
        );
      }
    }

    // Get single product by ID
    if (id) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/queries/?page=1&page_size=1000`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const product = data.results?.find((p: any) => p.id?.toString() === id);
          
          if (product) {
            // Transform Django product to frontend format
            const galleryImages = product.product_images?.length > 0
              ? product.product_images.map((img: any) => img.image_url || img.image).filter(Boolean)
              : [];
            
            const imagesArray = product.images?.length > 0
              ? product.images.filter(Boolean)
              : [];
            
            const primaryImage = product.image_url || product.image || "";
            const allImages = galleryImages.length > 0 
              ? galleryImages 
              : imagesArray.length > 0 
                ? imagesArray 
                : primaryImage 
                  ? [primaryImage] 
                  : [];

            // Get category name from slug
            const categorySlug = product.category_slug || "";
            const category = categorySlug ? shopCategories.find(cat => cat.slug === categorySlug) : null;
            
            const transformed = {
              id: product.id?.toString(),
              name: product.name,
              slug: product.slug,
              description: product.description || "",
              price: parseFloat(product.price) || 0,
              originalPrice: parseFloat(product.original_price) || null,
              image: primaryImage,
              images: allImages,
              category: category ? category.name : categorySlug,
              category_slug: categorySlug,
              brand: product.brand_slug,
              rating: parseFloat(product.rating) || 0,
              ratingCount: product.rating_count || 0,
              hot: product.hot || false,
              featured: product.featured || false,
              stock_quantity: product.stock_quantity || 0,
              sku: product.sku || "",
              tags: product.tags || [],
              condition: product.condition || "new",
              _isDjangoProduct: true,
            };
            
            return NextResponse.json(transformed);
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

    // Get single product by slug
    if (slug) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/queries/${slug}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const product = await response.json();
          
          // Transform Django product to frontend format
          const galleryImages = product.product_images?.length > 0
            ? product.product_images.map((img: any) => img.image_url || img.image).filter(Boolean)
            : [];
          
          const imagesArray = product.images?.length > 0
            ? product.images.filter(Boolean)
            : [];
          
          const primaryImage = product.image_url || product.image || "";
          const allImages = galleryImages.length > 0 
            ? galleryImages 
            : imagesArray.length > 0 
              ? imagesArray 
              : primaryImage 
                ? [primaryImage] 
                : [];

          // Get category name from slug
          const categorySlug = product.category_slug || "";
          const category = categorySlug ? shopCategories.find(cat => cat.slug === categorySlug) : null;
          
          const transformed = {
            id: product.id?.toString(),
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            price: parseFloat(product.price) || 0,
            originalPrice: parseFloat(product.original_price) || null,
            image: primaryImage,
            images: allImages,
            category: category ? category.name : categorySlug,
            category_slug: categorySlug,
            brand: product.brand_slug,
            rating: parseFloat(product.rating) || 0,
            ratingCount: product.rating_count || 0,
            hot: product.hot || false,
            featured: product.featured || false,
            stock_quantity: product.stock_quantity || 0,
            sku: product.sku || "",
            tags: product.tags || [],
            condition: product.condition || "new",
            _isDjangoProduct: true,
          };
          
          return NextResponse.json(transformed);
        }
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      } catch (error: any) {
        console.error("Error fetching product by slug:", error);
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

    if (brand_slug) {
      params.append("brand_slug", brand_slug);
    }

    // Fetch products from Django backend
    const url = `${API_BASE_URL}/products/queries/?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Django API error:", response.status);
        return NextResponse.json(
          { results: [], count: 0, page: 1, pageSize: 20, totalPages: 0 },
          { status: response.status }
        );
      }

      const data = await response.json();

      // Transform Django response to match frontend format
      const transformedResults = (data.results || []).map((product: any) => {
        // Handle images - prioritize product_images gallery, then images array, then single image_url
        const galleryImages = product.product_images?.length > 0
          ? product.product_images.map((img: any) => img.image_url || img.image).filter(Boolean)
          : [];
        
        const imagesArray = product.images?.length > 0
          ? product.images.filter(Boolean)
          : [];
        
        const primaryImage = product.image_url || product.image || "";
        const allImages = galleryImages.length > 0 
          ? galleryImages 
          : imagesArray.length > 0 
            ? imagesArray 
            : primaryImage 
              ? [primaryImage] 
              : [];

        // Get category name from slug
        const categorySlug = product.category_slug || "";
        const category = categorySlug ? shopCategories.find(cat => cat.slug === categorySlug) : null;
        
        return {
          id: product.id?.toString(),
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          price: parseFloat(product.price) || 0,
          originalPrice: parseFloat(product.original_price) || null,
          image: primaryImage,
          images: allImages,
          category: category ? category.name : categorySlug,
          category_slug: categorySlug,
          brand: product.brand_slug,
          rating: parseFloat(product.rating) || 0,
          ratingCount: product.rating_count || 0,
          hot: product.hot || false,
          featured: product.featured || false,
          stock_quantity: product.stock_quantity || 0,
          sku: product.sku || "",
          tags: product.tags || [],
          condition: product.condition || "new",
          // Mark as Django product to avoid image mapper interference
          _isDjangoProduct: true,
        };
      });

      return NextResponse.json({
        results: transformedResults,
        count: data.count || 0,
        page: data.current_page || parseInt(page),
        pageSize: data.page_size || parseInt(pageSize),
        totalPages: data.total_pages || Math.ceil((data.count || 0) / parseInt(pageSize)),
        hasNext: !!data.next,
        hasPrevious: !!data.previous,
      });
    } catch (error: any) {
      console.error("Failed to fetch products from Django:", error);
      return NextResponse.json(
        { results: [], count: 0, page: 1, pageSize: 20, totalPages: 0 },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("Failed to fetch products", error);
    return NextResponse.json(
      { results: [], count: 0, page: 1, pageSize: 20, totalPages: 0 },
      { status: 500 }
    );
  }
}

