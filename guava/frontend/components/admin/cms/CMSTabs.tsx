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

const tabs = [
  { id: "homepage", label: "Homepage", icon: HomeIcon, href: "/admin/cms?tab=homepage" },
  { id: "navigation", label: "Navigation", icon: Bars3Icon, href: "/admin/cms?tab=navigation" },
  { id: "hero", label: "Hero Sections", icon: PhotoIcon, href: "/admin/cms?tab=hero" },
  { id: "categories", label: "Categories", icon: FolderIcon, href: "/admin/cms?tab=categories" },
  { id: "inventory", label: "Inventory", icon: ShoppingBagIcon, href: "/admin/cms?tab=inventory" },
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
        <nav className="flex space-x-2 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`
                  flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 text-base font-semibold whitespace-nowrap
                  border-2 border-b-0 transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#98C243] border-[#98C243] text-white shadow-sm"
                      : "border-transparent border-b-2 border-b-gray-200 bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/70"
                  }
                `}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline leading-tight">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}



