import { NextRequest, NextResponse } from "next/server";
import { 
  hotDeals, 
  laptopDeals, 
  printerDeals, 
  accessoriesDeals, 
  audioDeals,
  brandLaptops 
} from "@/lib/data/products";
import { adminApiClient, PaginationParams } from "@/lib/admin-api/client";

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
      const result = await adminApiClient.getProduct(id, (itemId) => {
        const allProducts = getAllProducts();
        return allProducts.find((p) => 
          p.id === itemId || p.id?.toString() === itemId
        ) || null;
      });
      
      return NextResponse.json(result || {});
    }
    
    // Get paginated products
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    
    const params: PaginationParams = {
      page,
      pageSize,
      search,
      sortBy: sortBy || undefined,
      sortOrder,
    };
    
    const result = await adminApiClient.getProducts(params, () => getAllProducts());
    
    // Ensure result is always a valid paginated response
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response from getProducts');
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to fetch products", error);
    // Fallback to mock data - always return valid JSON
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '20');
    const search = request.nextUrl.searchParams.get('search') || '';
    
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
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create via API (with mock fallback)
    const result = await adminApiClient.createProduct(body, (data) => {
      return {
        ...data,
        id: Date.now().toString(),
      };
    });

    // Create a stock snapshot in inventory service
    try {
      await adminApiClient.createStockRecord(
        {
          product_id: result.id,
          quantity: Number(body.stock_quantity) || 0,
          warehouse: body.warehouse ?? null,
          low_stock_threshold: Number(body.low_stock_threshold) || 5,
        },
        () => undefined
      );
    } catch (stockError) {
      console.warn("Failed to create inventory record", stockError);
    }
    
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
    
    // Update via API (with mock fallback)
    const result = await adminApiClient.updateProduct(id, data, (itemId, itemData) => {
      const allProducts = getAllProducts();
      const product = allProducts.find((p) => 
        p.id === itemId || p.id?.toString() === itemId
      );
      return product ? { ...product, ...itemData } : null;
    });
    
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
    
    // Delete via API (with mock fallback)
    await adminApiClient.deleteProduct(id, (itemId) => {
      console.log(`Mock delete product: ${itemId}`);
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

