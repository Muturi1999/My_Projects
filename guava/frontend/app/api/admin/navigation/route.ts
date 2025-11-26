import { NextRequest, NextResponse } from "next/server";
import { getNavigationCMS, updateNavigationCMS } from "@/lib/data/cms/store";
import { NavigationCMSData } from "@/lib/types/cms";

export async function GET() {
  try {
    const data = getNavigationCMS();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch navigation data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as NavigationCMSData;
    updateNavigationCMS(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update navigation data" }, { status: 500 });
  }
}



