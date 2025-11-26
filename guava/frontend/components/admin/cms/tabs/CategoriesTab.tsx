"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TaxonomyCMSData } from "@/lib/types/taxonomy";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CategoriesTab() {
  const [data, setData] = useState<TaxonomyCMSData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/taxonomy")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Categories & SEO</h2>
          <p className="text-sm text-gray-500 mt-1">Manage category taxonomy, slugs, and SEO metadata.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/taxonomy")}
          >
            Full Editor
          </Button>
          <Link href="/" target="_blank" className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Preview
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500 mb-4">Quick access to category management. Use "Full Editor" for complete taxonomy management.</p>
        {data && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Total Categories: {data.categories.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}



