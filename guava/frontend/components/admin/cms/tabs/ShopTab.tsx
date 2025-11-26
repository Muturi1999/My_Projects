"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ShopTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Shop Page</h2>
          <p className="text-sm text-gray-500 mt-1">Configure filters, sort options, and default listings.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]" size="sm">
            Save
          </Button>
          <Link href="/category/laptops-computers" target="_blank" className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Preview
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Shop page configuration interface coming soon...</p>
      </div>
    </div>
  );
}



