import { NextRequest, NextResponse } from "next/server";
import { shopCategories } from "@/lib/data/categories";
import { env } from "@/lib/config/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // Try to fetch from Django backend first
    try {
      const djangoUrl = id 
        ? `${API_BASE_URL}/products/categories/${id}/`
        : `${API_BASE_URL}/products/categories/?page=${searchParams.get('page') || '1'}&page_size=${searchParams.get('pageSize') || '20'}`;
      
      const response = await fetch(djangoUrl, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle single category response
        if (id) {
          const category = {
            id: data.id?.toString(),
            name: data.name,
            slug: data.slug,
            description: data.description,
            image: data.image_url || data.image,
          };
          // Only return Django data if it's valid
          if (category.id && category.name) {
            return NextResponse.json(category);
          }
        } else {
          // Handle paginated response
          const djangoResults = (data.results || []).map((cat: any) => ({
            id: cat.id?.toString(),
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image_url || cat.image,
          }));
          
          // Use Django data if there are results
          if (djangoResults.length > 0) {
            return NextResponse.json({
              results: djangoResults,
              count: data.count || 0,
              page: data.current_page || parseInt(searchParams.get('page') || '1'),
              pageSize: data.page_size || parseInt(searchParams.get('pageSize') || '20'),
              totalPages: data.total_pages || Math.ceil((data.count || 0) / parseInt(searchParams.get('pageSize') || '20')),
              hasNext: !!data.next,
              hasPrevious: !!data.previous,
            });
          }
          // If Django returns empty, fall through to static data
        }
      }
    } catch (djangoError) {
      console.warn("Failed to fetch categories from Django, falling back to static data:", djangoError);
    }
    
    // Fallback to static data if Django is unavailable
    // Get single category
    if (id) {
      const category = shopCategories.find((cat) => 
        cat.id === id || cat.id?.toString() === id || cat.slug === id
      );
      return NextResponse.json(category || null);
    }
    
    // Get paginated categories
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return NextResponse.json({
      results: shopCategories.slice(start, end),
      count: shopCategories.length,
      page,
      pageSize,
      totalPages: Math.ceil(shopCategories.length / pageSize),
      hasNext: end < shopCategories.length,
      hasPrevious: page > 1,
    });
  } catch (error: any) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json({
      results: [],
      count: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Note: Categories are stored in static files, so this is a mock operation
    const result = {
      ...body,
      id: Date.now().toString(),
    };
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create category", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    // Note: Categories are stored in static files, so this is a mock operation
    const category = shopCategories.find((cat) => 
      cat.id === id || cat.id?.toString() === id || cat.slug === id
    );
    const result = category ? { ...category, ...data } : null;
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to update category", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    // Note: Categories are stored in static files, so this is a mock operation
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete category", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

