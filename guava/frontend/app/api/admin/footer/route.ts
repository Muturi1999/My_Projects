import { NextRequest, NextResponse } from "next/server";
import { getFooterCMS, updateFooterCMS } from "@/lib/data/cms/store";
import { FooterCMSData } from "@/lib/types/cms";
import { adminApiClient } from "@/lib/admin-api/client";

export async function GET() {
  try {
    const data = await adminApiClient.getFooter(() => getFooterCMS());
    
    // Normalize response format
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data[0]);
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch footer data", error);
    // Fallback to mock data
    return NextResponse.json(getFooterCMS());
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as FooterCMSData;
    
    // Update via API (with mock fallback)
    await adminApiClient.updateFooter(body, (data) => {
      updateFooterCMS(data);
      return data;
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update footer data", error);
    
    // Fallback to mock update
    try {
      const body = (await request.json()) as FooterCMSData;
      updateFooterCMS(body);
      return NextResponse.json({ success: true });
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to update footer data" }, { status: 500 });
    }
  }
}



