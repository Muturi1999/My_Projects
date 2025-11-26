import { NextRequest, NextResponse } from "next/server";
import { getShopPageCMS, updateShopPageCMS } from "@/lib/data/cms/store";
import { ShopPageCMSData } from "@/lib/types/cms";

export async function GET() {
  try {
    const data = getShopPageCMS();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shop page data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as ShopPageCMSData;
    updateShopPageCMS(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update shop page data" }, { status: 500 });
  }
}



