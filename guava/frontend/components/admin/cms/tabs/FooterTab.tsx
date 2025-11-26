"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FooterTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Footer & Service Sections</h2>
          <p className="text-sm text-gray-500 mt-1">Manage footer links, service guarantees, and contact information.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]" size="sm">
            Save
          </Button>
          <Link href="/" target="_blank" className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Preview
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Footer and service sections management interface coming soon...</p>
      </div>
    </div>
  );
}



