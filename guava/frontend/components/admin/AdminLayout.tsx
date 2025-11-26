"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <div className="min-h-screen flex bg-gray-50">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white lg:hidden transform ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 shadow-lg`}
        >
          <AdminSidebar isOpen={true} onToggle={() => setIsMobileSidebarOpen(false)} />
        </div>
        <div className="flex-1 flex flex-col">
          <AdminTopBar onMenuClick={() => setIsMobileSidebarOpen((prev) => !prev)} />
          <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </>
  );
}

