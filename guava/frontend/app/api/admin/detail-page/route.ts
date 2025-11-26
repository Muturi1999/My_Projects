import { NextRequest, NextResponse } from "next/server";
import { getDetailPageCMS, updateDetailPageCMS } from "@/lib/data/cms/store";
import { DetailPageCMSData } from "@/lib/types/cms";

export async function GET() {
  try {
    const data = getDetailPageCMS();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch detail page data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as DetailPageCMSData;
    updateDetailPageCMS(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update detail page data" }, { status: 500 });
  }
}



