import { NextResponse } from "next/server";
import { getTaxonomyCMS, updateTaxonomyCMS } from "@/lib/data/cms/store";
import { TaxonomyCMSData } from "@/lib/types/taxonomy";
import { adminApiClient } from "@/lib/admin-api/client";

export async function GET() {
  try {
    // Taxonomy is a combination of categories and brands from catalog
    // For now, we'll use mock data but could fetch from catalog API
    const data = getTaxonomyCMS();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch taxonomy CMS", error);
    return NextResponse.json(getTaxonomyCMS());
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as TaxonomyCMSData;
    
    // Update via mock store (taxonomy is derived from catalog)
    // In future, this could update categories/brands via catalog API
    updateTaxonomyCMS(body);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update taxonomy CMS", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

