import { NextRequest, NextResponse } from "next/server";
import { popularBrands } from "@/lib/data/categories";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // Get single brand
    if (id) {
      const brand = popularBrands.find((b) => 
        b.id === id || b.id?.toString() === id || b.slug === id
      );
      return NextResponse.json(brand || null);
    }
    
    // Get paginated brands
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return NextResponse.json({
      results: popularBrands.slice(start, end),
      count: popularBrands.length,
      page,
      pageSize,
      totalPages: Math.ceil(popularBrands.length / pageSize),
      hasNext: end < popularBrands.length,
      hasPrevious: page > 1,
    });
  } catch (error: any) {
    console.error("Failed to fetch brands", error);
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
    // Note: Brands are stored in static files, so this is a mock operation
    const result = {
      ...body,
      id: Date.now().toString(),
    };
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create brand", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    // Note: Brands are stored in static files, so this is a mock operation
    const brand = popularBrands.find((b) => 
      b.id === id || b.id?.toString() === id || b.slug === id
    );
    const result = brand ? { ...brand, ...data } : null;
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to update brand", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    // Note: Brands are stored in static files, so this is a mock operation
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete brand", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}

