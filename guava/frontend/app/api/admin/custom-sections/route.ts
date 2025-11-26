import { NextRequest, NextResponse } from "next/server";
import { getCustomSectionsCMS, updateCustomSectionsCMS } from "@/lib/data/cms/store";
import { CustomSectionsCMSData } from "@/lib/types/cms";

export async function GET() {
  try {
    const data = getCustomSectionsCMS();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch custom sections data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomSectionsCMSData;
    updateCustomSectionsCMS(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update custom sections data" }, { status: 500 });
  }
}



