import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "images");
    await fs.mkdir(uploadsDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = path.extname(file.name) || "";
      const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, buffer);

      // Return relative path - Next.js will serve from public folder
      urls.push(`/images/${filename}`);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (error: any) {
    console.error("Upload failed", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload" },
      { status: 500 }
    );
  }
}
