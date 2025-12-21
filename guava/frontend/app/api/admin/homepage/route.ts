import { NextResponse } from "next/server";
import { getHomepageCMS, updateHomepageCMS } from "@/lib/data/cms/store";
import { HomepageCMSData } from "@/lib/types/cms";

export async function GET() {
  try {
    const data = getHomepageCMS();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch homepage CMS", error);
    return NextResponse.json(getHomepageCMS());
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as HomepageCMSData;
    updateHomepageCMS(body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update homepage CMS", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

