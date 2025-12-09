"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  Bars3Icon,
  PhotoIcon,
  FolderIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const tabs = [
  { id: "homepage", label: "Homepage", icon: HomeIcon, href: "/admin/cms?tab=homepage" },
  { id: "navigation", label: "Navigation", icon: Bars3Icon, href: "/admin/cms?tab=navigation" },
  { id: "hero", label: "Hero Sections", icon: PhotoIcon, href: "/admin/cms?tab=hero" },
  { id: "categories", label: "Categories", icon: FolderIcon, href: "/admin/cms?tab=categories" },
  { id: "shop", label: "Shop Page", icon: ShoppingBagIcon, href: "/admin/cms?tab=shop" },
  { id: "detail", label: "Product Detail", icon: DocumentTextIcon, href: "/admin/cms?tab=detail" },
  { id: "footer", label: "Footer & Services", icon: InformationCircleIcon, href: "/admin/cms?tab=footer" },
  { id: "custom", label: "Custom Sections", icon: PuzzlePieceIcon, href: "/admin/cms?tab=custom" },
];

interface CMSTabsProps {
  activeTab: string;
}

export function CMSTabs({ activeTab }: CMSTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <nav className="flex space-x-1 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`
                  flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors
                  ${
                    isActive
                      ? "border-[#A7E059] text-[#A7E059]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}









