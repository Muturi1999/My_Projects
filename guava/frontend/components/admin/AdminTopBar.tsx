"use client";

import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface AdminTopBarProps {
  onMenuClick: () => void;
}

export function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden rounded-md border border-gray-200 p-2 hover:bg-gray-50"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-5 w-5 text-gray-600" />
        </button>
        <div className="relative hidden sm:block">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
          <input
            type="search"
            placeholder="Search products, orders, customers..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#A7E059]/30 focus:border-[#A7E059]/50 w-72 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full border border-gray-200 p-2 hover:bg-gray-50" aria-label="Notifications">
          <BellIcon className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500">Operations Lead</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#A7E059]/20 flex items-center justify-center text-sm font-semibold text-[#2D3A06]">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}

