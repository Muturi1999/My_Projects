import { NextRequest, NextResponse } from "next/server";
import { 
  hotDeals, 
  laptopDeals, 
  printerDeals, 
  accessoriesDeals, 
  audioDeals,
  brandLaptops 
} from "@/lib/data/products";

// Helper to get all products
function getAllProducts() {
  try {
    // brandLaptops is a Record<string, Product[]>, so we need to flatten it
    const brandLaptopsArray = Object.values(brandLaptops || {}).flat();
    
    return [
      ...(hotDeals || []),
      ...(laptopDeals || []),
      ...(printerDeals || []),
      ...(accessoriesDeals || []),
      ...(audioDeals || []),
      ...(brandLaptopsArray || []),
    ];
  } catch (error) {
    console.error("Error getting all products:", error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // Get single product
    if (id) {
      const allProducts = getAllProducts();
      const product = allProducts.find((p) => 
        p.id === id || p.id?.toString() === id
      );
      return NextResponse.json(product || {});
    }
    
    // Get paginated products
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    
    let allProducts = getAllProducts();
    
    // Apply search filter
    if (search) {
      allProducts = allProducts.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return NextResponse.json({
      results: allProducts.slice(start, end),
      count: allProducts.length,
      page,
      pageSize,
      totalPages: Math.ceil(allProducts.length / pageSize),
      hasNext: end < allProducts.length,
      hasPrevious: page > 1,
    });
  } catch (error: any) {
    console.error("Failed to fetch products", error);
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
    const result = {
      ...body,
      id: Date.now().toString(),
    };
    // Note: Products are stored in static files, so this is a mock operation
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    const allProducts = getAllProducts();
    const product = allProducts.find((p) => 
      p.id === id || p.id?.toString() === id
    );
    const result = product ? { ...product, ...data } : null;
    
    // Note: Products are stored in static files, so this is a mock operation
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to update product", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    // Note: Products are stored in static files, so this is a mock operation
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

