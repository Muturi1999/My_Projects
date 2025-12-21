import { NextRequest, NextResponse } from "next/server";
import { getFooterCMS, updateFooterCMS } from "@/lib/data/cms/store";
import { FooterCMSData } from "@/lib/types/cms";

export async function GET() {
  try {
    const data = getFooterCMS();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch footer data", error);
    return NextResponse.json(getFooterCMS());
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as FooterCMSData;
    updateFooterCMS(body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update footer data", error);
    return NextResponse.json({ error: "Failed to update footer data" }, { status: 500 });
  }
}



