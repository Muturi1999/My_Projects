import { NextResponse } from "next/server";
import { getHomepageCMS, updateHomepageCMS } from "@/lib/data/cms/store";
import { HomepageCMSData } from "@/lib/types/cms";
import { adminApiClient } from "@/lib/admin-api/client";

export async function GET() {
  try {
    const data = await adminApiClient.getHomepage(() => getHomepageCMS());
    
    // Normalize response format for frontend
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data[0]);
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch homepage CMS", error);
    // Fallback to mock data
    return NextResponse.json(getHomepageCMS());
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as HomepageCMSData;
    
    // Update via API (with mock fallback)
    await adminApiClient.updateHomepage(body, (data) => {
      updateHomepageCMS(data);
      return data;
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update homepage CMS", error);
    
    // Fallback to mock update
    try {
      const body = (await request.json()) as HomepageCMSData;
      updateHomepageCMS(body);
      return NextResponse.json({ success: true });
    } catch (fallbackError) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  }
}

