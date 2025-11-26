import { NextRequest, NextResponse } from "next/server";
import { getServiceGuaranteesCMS, updateServiceGuaranteesCMS } from "@/lib/data/cms/store";
import { ServiceGuaranteesCMSData } from "@/lib/types/cms";
import { adminApiClient } from "@/lib/admin-api/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      // Get single item
      const allData = await adminApiClient.getServiceGuarantees(() => getServiceGuaranteesCMS());
      const items = Array.isArray(allData) 
        ? allData 
        : (allData?.guarantees || allData?.sections || []);
      const item = items.find((item: any) => item.id === id || item.id?.toString() === id);
      return NextResponse.json(item || null);
    }
    
    // Get all service guarantees
    const data = await adminApiClient.getServiceGuarantees(() => getServiceGuaranteesCMS());
    
    // Normalize response format
    if (Array.isArray(data)) {
      return NextResponse.json({ guarantees: data });
    }
    
    // If it's an object with guarantees, return as is
    if (data && typeof data === 'object' && 'guarantees' in data) {
      return NextResponse.json(data);
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch service guarantees data", error);
    // Fallback to mock data
    return NextResponse.json(getServiceGuaranteesCMS());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create via API (with mock fallback)
    const result = await adminApiClient.createServiceGuarantee(body, (data) => {
      const current = getServiceGuaranteesCMS();
      const newItem = {
        ...data,
        id: Date.now().toString(), // Generate ID for mock
      };
      const updated = {
        guarantees: [...(current.guarantees || []), newItem]
      };
      updateServiceGuaranteesCMS(updated as ServiceGuaranteesCMSData);
      return newItem;
    });
    
    return NextResponse.json(result, { status: 201 });
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
    
    // Update single item via API (with mock fallback)
    const result = await adminApiClient.updateServiceGuarantee(id, data, (itemId, itemData) => {
      const current = getServiceGuaranteesCMS();
      const guarantees = (current.guarantees || []).map((item: any) =>
        (item.id === itemId || item.id?.toString() === itemId) ? { ...item, ...itemData } : item
      );
      updateServiceGuaranteesCMS({ guarantees } as ServiceGuaranteesCMSData);
      return guarantees.find((item: any) => item.id === itemId || item.id?.toString() === itemId);
    });
    
    return NextResponse.json(result);
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
    
    // Delete via API (with mock fallback)
    await adminApiClient.deleteServiceGuarantee(id, (itemId) => {
      const current = getServiceGuaranteesCMS();
      const guarantees = (current.guarantees || []).filter(
        (item: any) => item.id !== itemId && item.id?.toString() !== itemId
      );
      updateServiceGuaranteesCMS({ guarantees } as ServiceGuaranteesCMSData);
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete service guarantee", error);
    return NextResponse.json({ error: "Failed to delete service guarantee" }, { status: 500 });
  }
}



