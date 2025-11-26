"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  delta?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
}

const trendClasses = {
  up: "text-emerald-600",
  down: "text-red-500",
  neutral: "text-gray-500",
};

export function StatCard({ label, value, delta, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <div className="h-10 w-10 rounded-xl bg-[#F3FCE1] flex items-center justify-center text-[#4B6A11]">{icon}</div>}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-semibold text-gray-900">{value}</p>
        {delta && (
          <p className={`text-xs md:text-sm font-medium mt-1 ${trendClasses[delta.trend]}`}>
            {delta.trend === "up" && "▲"}
            {delta.trend === "down" && "▼"}
            {delta.trend === "neutral" && "—"} {delta.value}
          </p>
        )}
      </div>
    </div>
  );
}

