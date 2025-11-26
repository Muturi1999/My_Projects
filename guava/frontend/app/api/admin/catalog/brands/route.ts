import { NextRequest, NextResponse } from "next/server";
import { popularBrands } from "@/lib/data/categories";
import { adminApiClient, PaginationParams } from "@/lib/admin-api/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // Get single brand
    if (id) {
      const allData = await adminApiClient.getBrands(undefined, () => popularBrands);
      const brands = allData.results || [];
      const brand = brands.find((b: any) => 
        b.id === id || b.id?.toString() === id || b.slug === id
      );
      return NextResponse.json(brand || null);
    }
    
    // Get paginated brands
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
    
    const result = await adminApiClient.getBrands(params, () => popularBrands);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to fetch brands", error);
    // Fallback to mock data
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '20');
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
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create via API (with mock fallback)
    const result = await adminApiClient.createBrand(body, (data) => {
      return {
        ...data,
        id: Date.now().toString(),
      };
    });
    
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
    
    // Update via API (with mock fallback)
    const result = await adminApiClient.updateBrand(id, data, (itemId, itemData) => {
      const brand = popularBrands.find((b) => 
        b.id === itemId || b.id?.toString() === itemId || b.slug === itemId
      );
      return brand ? { ...brand, ...itemData } : null;
    });
    
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
    
    // Delete via API (with mock fallback)
    await adminApiClient.deleteBrand(id, (itemId) => {
      console.log(`Mock delete brand: ${itemId}`);
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete brand", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}

