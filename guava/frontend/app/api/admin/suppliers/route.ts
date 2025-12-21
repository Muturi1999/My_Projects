import { NextRequest, NextResponse } from "next/server";
import { mockSuppliers } from "@/lib/data/admin/mockSuppliers";
import { slugify } from "@/lib/utils/slugify";

function buildPaginationParams(searchParams: URLSearchParams) {
  return {
    page: Number(searchParams.get("page") || "1"),
    pageSize: Number(searchParams.get("pageSize") || "20"),
    search: searchParams.get("search") || undefined,
  };
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    results: items.slice(start, end),
    count: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
    hasNext: end < items.length,
    hasPrevious: page > 1,
  };
}

export async function GET(request: NextRequest) {
  try {
    const params = buildPaginationParams(request.nextUrl.searchParams);
    let suppliers = mockSuppliers;
    
    // Apply search filter
    if (params.search) {
      suppliers = suppliers.filter((s) =>
        s.name?.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    const paginated = paginate(suppliers, params.page, params.pageSize);
    return NextResponse.json(paginated);
  } catch (error: any) {
    console.error("Failed to fetch suppliers", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      ...body,
      slug: body.slug || slugify(body.name || ""),
      tags: body.tags || [],
      id: `mock-${Date.now()}`,
    };
    // Note: Suppliers are stored in static files, so this is a mock operation
    return NextResponse.json(payload, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create supplier", error);
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}

