import { NextRequest, NextResponse } from "next/server";
import { getServiceGuaranteesCMS, updateServiceGuaranteesCMS } from "@/lib/data/cms/store";
import { ServiceGuaranteesCMSData } from "@/lib/types/cms";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    const cmsData = getServiceGuaranteesCMS();
    
    if (id) {
      // Get single item
      const guarantees = cmsData.guarantees || [];
      const item = guarantees.find((item: any) => item.id === id || item.id?.toString() === id);
      return NextResponse.json(item || null);
    }
    
    // Get all service guarantees
    return NextResponse.json(cmsData);
  } catch (error: any) {
    console.error("Failed to fetch service guarantees data", error);
    return NextResponse.json(getServiceGuaranteesCMS());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const current = getServiceGuaranteesCMS();
    const newItem = {
      ...body,
      id: Date.now().toString(), // Generate ID
    };
    const updated = {
      guarantees: [...(current.guarantees || []), newItem]
    };
    updateServiceGuaranteesCMS(updated as ServiceGuaranteesCMSData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create service guarantee", error);
    return NextResponse.json({ error: "Failed to create service guarantee" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      // Update entire collection (legacy behavior)
      updateServiceGuaranteesCMS(body as ServiceGuaranteesCMSData);
      return NextResponse.json({ success: true });
    }
    
    // Update single item
    const current = getServiceGuaranteesCMS();
    const guarantees = (current.guarantees || []).map((item: any) =>
      (item.id === id || item.id?.toString() === id) ? { ...item, ...data } : item
    );
    updateServiceGuaranteesCMS({ guarantees } as ServiceGuaranteesCMSData);
    const updated = guarantees.find((item: any) => item.id === id || item.id?.toString() === id);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update service guarantee", error);
    return NextResponse.json({ error: "Failed to update service guarantee" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    const current = getServiceGuaranteesCMS();
    const guarantees = (current.guarantees || []).filter(
      (item: any) => item.id !== id && item.id?.toString() !== id
    );
    updateServiceGuaranteesCMS({ guarantees } as ServiceGuaranteesCMSData);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete service guarantee", error);
    return NextResponse.json({ error: "Failed to delete service guarantee" }, { status: 500 });
  }
}



