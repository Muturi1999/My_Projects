import { NextResponse } from "next/server";
import { syncFrontendToCMS } from "@/scripts/syncFrontendToCMS";

export async function POST() {
  try {
    console.log("API: Starting sync from frontend to CMS...");
    const result = syncFrontendToCMS();
    console.log("API: Sync completed", {
      success: result.success,
      stats: result.stats,
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        stats: result.stats,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Failed to sync frontend to CMS", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

