"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSuccess(false);
    setMessage(null);
    setStats(null);

    try {
      const response = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage(data.message);
        setStats(data.stats);
        // Reset success state after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setSuccess(false);
        setMessage(data.message || "Sync failed");
      }
    } catch (error) {
      console.error("Failed to sync", error);
      setSuccess(false);
      setMessage("Failed to sync. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleSync}
        disabled={isSyncing}
        className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]"
        size="sm"
      >
        <ArrowPathIcon className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
        {isSyncing ? "Syncing..." : "Sync Frontend to CMS"}
      </Button>
      
      {message && (
        <div
          className={`rounded-lg border px-4 py-2 text-sm ${
            success
              ? "border-emerald-200 text-emerald-800 bg-emerald-50"
              : "border-red-200 text-red-800 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {success && <CheckCircleIcon className="h-4 w-4" />}
            <span>{message}</span>
          </div>
          {success && stats && (
            <div className="mt-2 pt-2 border-t border-emerald-200 text-xs">
              <p>Hero Slides: {stats.heroSlides}</p>
              <p>Categories: {stats.categories}</p>
              <p>Hot Deals: {stats.hotDeals}</p>
              <p>Laptop Deals: {stats.laptopDeals}</p>
              <p>Printer Deals: {stats.printerDeals}</p>
              <p>Accessories Deals: {stats.accessoriesDeals}</p>
              <p>Audio Deals: {stats.audioDeals}</p>
              <p>Popular Brands: {stats.popularBrands}</p>
              <p>Popular Categories: {stats.popularCategories}</p>
              <p>Total Products: {stats.totalProducts}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

