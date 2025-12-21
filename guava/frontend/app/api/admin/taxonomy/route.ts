import { NextResponse } from "next/server";
import { getTaxonomyCMS, updateTaxonomyCMS } from "@/lib/data/cms/store";
import { TaxonomyCMSData } from "@/lib/types/taxonomy";

export async function GET() {
  try {
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
    updateTaxonomyCMS(body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update taxonomy CMS", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

