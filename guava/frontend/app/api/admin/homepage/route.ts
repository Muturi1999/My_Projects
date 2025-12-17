import { NextResponse } from "next/server";
import { getHomepageCMS, updateHomepageCMS } from "@/lib/data/cms/store";
import { HomepageCMSData } from "@/lib/types/cms";
import { adminApiClient } from "@/lib/admin-api/client";

/**
 * Transform snake_case API response to camelCase for frontend
 */
function transformApiToFrontend(apiData: any): HomepageCMSData {
  if (!apiData) return getHomepageCMS();
  
  // Handle array response (get first item)
  const data = Array.isArray(apiData) ? apiData[0] : apiData;
  
  return {
    heroSlides: data.hero_slides || data.heroSlides || [],
    shopByCategory: data.shop_by_category || data.shopByCategory || { id: "", title: "", items: [] },
    featuredDeals: data.featured_deals || data.featuredDeals || { id: "", title: "", items: [] },
    hotDeals: data.hot_deals || data.hotDeals || { id: "", title: "", items: [] },
    printerScanner: data.printer_scanner || data.printerScanner || { id: "", title: "", items: [] },
    accessories: data.accessories || { id: "", title: "", items: [] },
    audio: data.audio || { id: "", title: "", items: [] },
    popularBrands: data.popular_brands || data.popularBrands || { id: "", title: "", items: [] },
    popularCategories: data.popular_categories || data.popularCategories || { id: "", title: "", items: [] },
  };
}

/**
 * Transform camelCase frontend data to snake_case for API
 */
function transformFrontendToApi(frontendData: HomepageCMSData): any {
  return {
    title: "Homepage",
    description: "",
    hero_slides: frontendData.heroSlides || [],
    shop_by_category: frontendData.shopByCategory || {},
    featured_deals: frontendData.featuredDeals || {},
    hot_deals: frontendData.hotDeals || {},
    custom_sections: [],
  };
}

export async function GET() {
  try {
    const data = await adminApiClient.getHomepage(() => getHomepageCMS());
    
    // Transform API response (snake_case) to frontend format (camelCase)
    const transformed = transformApiToFrontend(data);
    
    return NextResponse.json(transformed);
  } catch (error: any) {
    console.error("Failed to fetch homepage CMS", error);
    // Fallback to mock data
    return NextResponse.json(getHomepageCMS());
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as HomepageCMSData;
    
    // Transform frontend data (camelCase) to API format (snake_case)
    const apiData = transformFrontendToApi(body);
    
    // Update via API (with mock fallback)
    await adminApiClient.updateHomepage(apiData, (data) => {
      updateHomepageCMS(body); // Keep frontend format in mock store
      return data;
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update homepage CMS", error);
    
    // Fallback to mock update
    try {
      const requestBody = await request.json() as HomepageCMSData;
      updateHomepageCMS(requestBody);
      return NextResponse.json({ success: true });
    } catch (fallbackError) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  }
}

