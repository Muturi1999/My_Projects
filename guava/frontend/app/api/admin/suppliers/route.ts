import { NextRequest, NextResponse } from "next/server";
import { adminApiClient } from "@/lib/admin-api/client";
import { mockSuppliers } from "@/lib/data/admin/mockSuppliers";
import { slugify } from "@/lib/utils/slugify";

function buildPaginationParams(searchParams: URLSearchParams) {
  return {
    page: Number(searchParams.get("page") || "1"),
    pageSize: Number(searchParams.get("pageSize") || "20"),
    search: searchParams.get("search") || undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const params = buildPaginationParams(request.nextUrl.searchParams);
    const suppliers = await adminApiClient.getSuppliers(params, () => mockSuppliers);
    return NextResponse.json(suppliers);
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
    };
    const supplier = await adminApiClient.createSupplier(payload, (data) => ({
      ...data,
      id: `mock-${Date.now()}`,
      slug: payload.slug,
    }));
    return NextResponse.json(supplier, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create supplier", error);
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}

