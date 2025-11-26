import { NextRequest, NextResponse } from "next/server";
import { getNavigationCMS, updateNavigationCMS } from "@/lib/data/cms/store";
import { NavigationCMSData } from "@/lib/types/cms";
import { adminApiClient } from "@/lib/admin-api/client";

export async function GET() {
  try {
    const data = await adminApiClient.getNavigation(() => getNavigationCMS());
    
    // Normalize response format
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data[0]);
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch navigation data", error);
    // Fallback to mock data
    return NextResponse.json(getNavigationCMS());
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as NavigationCMSData;
    
    // Update via API (with mock fallback)
    await adminApiClient.updateNavigation(body, (data) => {
      updateNavigationCMS(data);
      return data;
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update navigation data", error);
    
    // Fallback to mock update
    try {
      const body = (await request.json()) as NavigationCMSData;
      updateNavigationCMS(body);
      return NextResponse.json({ success: true });
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to update navigation data" }, { status: 500 });
    }
  }
}



