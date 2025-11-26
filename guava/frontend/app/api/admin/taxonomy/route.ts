import { NextResponse } from "next/server";
import { getTaxonomyCMS, updateTaxonomyCMS } from "@/lib/data/cms/store";
import { TaxonomyCMSData } from "@/lib/types/taxonomy";

export async function GET() {
  return NextResponse.json(getTaxonomyCMS());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as TaxonomyCMSData;
    updateTaxonomyCMS(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update taxonomy CMS", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

