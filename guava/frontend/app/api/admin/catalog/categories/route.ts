import { NextRequest, NextResponse } from "next/server";
import { shopCategories } from "@/lib/data/categories";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
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

