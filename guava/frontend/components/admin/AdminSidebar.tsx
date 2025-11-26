"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  CubeIcon,
  TagIcon,
  ArchiveBoxIcon,
  ShoppingBagIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3BottomLeftIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Squares2X2Icon },
  { label: "CMS", href: "/admin/cms", icon: DocumentTextIcon },
  { label: "Catalog", href: "/admin/catalog", icon: CubeIcon },
  { label: "Promotions", href: "/admin/promotions", icon: TagIcon },
  { label: "Taxonomy & SEO", href: "/admin/taxonomy", icon: GlobeAltIcon },
  { label: "Inventory", href: "/admin/inventory", icon: ArchiveBoxIcon },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
  { label: "Support", href: "/admin/support", icon: ChatBubbleBottomCenterTextIcon },
  { label: "Reports", href: "/admin/reports", icon: ChartBarIcon },
  { label: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300`}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3">
        <span className="text-xl font-bold text-gray-900 tracking-wide">
          {isOpen ? "Guava Admin" : "GA"}
        </span>
        <button
          onClick={onToggle}
          className="ml-auto hidden lg:inline-flex items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-500 hover:text-gray-900"
          aria-label="Toggle sidebar width"
        >
          <Bars3BottomLeftIcon className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive ? "text-[#A7E059] bg-[#F3FCE1]" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#A7E059]/20 flex items-center justify-center text-sm font-semibold text-[#2D3A06]">
            G
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@guava.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

