import { NextRequest, NextResponse } from "next/server";
import { getServiceGuaranteesCMS, updateServiceGuaranteesCMS } from "@/lib/data/cms/store";
import { ServiceGuaranteesCMSData } from "@/lib/types/cms";

export async function GET() {
  try {
    const data = getServiceGuaranteesCMS();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service guarantees data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as ServiceGuaranteesCMSData;
    updateServiceGuaranteesCMS(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service guarantees data" }, { status: 500 });
  }
}



