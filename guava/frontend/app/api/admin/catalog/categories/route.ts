import { NextRequest, NextResponse } from "next/server";
import { shopCategories } from "@/lib/data/categories";
import { adminApiClient, PaginationParams } from "@/lib/admin-api/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // Get single category
    if (id) {
      const allData = await adminApiClient.getCategories(undefined, () => shopCategories);
      const categories = allData.results || [];
      const category = categories.find((cat: any) => 
        cat.id === id || cat.id?.toString() === id || cat.slug === id
      );
      return NextResponse.json(category || null);
    }
    
    // Get paginated categories
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';
    
    const params: PaginationParams = {
      page,
      pageSize,
      search,
      sortBy: sortBy || undefined,
      sortOrder,
    };
    
    const result = await adminApiClient.getCategories(params, () => shopCategories);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to fetch categories", error);
    // Fallback to mock data
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '20');
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
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create via API (with mock fallback)
    const result = await adminApiClient.createCategory(body, (data) => {
      // Mock: just return the data (would need to add to store)
      return {
        ...data,
        id: Date.now().toString(),
      };
    });
    
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
    
    // Update via API (with mock fallback)
    const result = await adminApiClient.updateCategory(id, data, (itemId, itemData) => {
      // Mock: find and update (would need to update store)
      const category = shopCategories.find((cat) => 
        cat.id === itemId || cat.id?.toString() === itemId || cat.slug === itemId
      );
      return category ? { ...category, ...itemData } : null;
    });
    
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
    
    // Delete via API (with mock fallback)
    await adminApiClient.deleteCategory(id, (itemId) => {
      // Mock: would remove from store
      console.log(`Mock delete category: ${itemId}`);
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete category", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

